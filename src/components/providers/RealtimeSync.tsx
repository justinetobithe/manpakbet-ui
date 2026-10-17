"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AppToast } from "@/components/app";
import { adminKeys } from "@/lib/AdminAPI";
import { formatMoney } from "@/lib/format";
import { createEcho, type TransactionRequestedEvent, type TransactionUpdatedEvent } from "@/lib/realtime";
import { walletKeys } from "@/lib/WalletAPI";
import type { WalletSummary } from "@/types/Wallet";

const label = (type: string) => (type === "withdraw" ? "Withdrawal" : type === "deposit" ? "Deposit" : "Transaction");

export default function RealtimeSync() {
    const { data, status } = useSession();
    const queryClient = useQueryClient();
    const token = data?.user?.auth_token;
    const userId = data?.user?.id;
    const canProcess = Boolean(data?.user?.permissions?.includes("transactions.process"));

    React.useEffect(() => {
        if (status !== "authenticated" || !token || !userId) return;

        const echo = createEcho(token);
        if (!echo) return;

        echo.private(`App.Models.User.${userId}`).listen(".transaction.updated", (event: TransactionUpdatedEvent) => {
            const { transaction, balance } = event;

            queryClient.setQueryData<WalletSummary>(walletKeys.summary(), (current) => (current ? { ...current, balance } : current));
            void queryClient.invalidateQueries({ queryKey: walletKeys.all });

            if (transaction.status === "approved") {
                AppToast.success(transaction.type === "deposit" ? `${formatMoney(transaction.amount)} added to your balance` : `${label(transaction.type)} of ${formatMoney(transaction.amount)} approved`, {
                    description: `Reference ${transaction.reference}`,
                });
            } else if (transaction.status === "rejected") {
                AppToast.error(`${label(transaction.type)} rejected`, { description: transaction.notes || `Reference ${transaction.reference}` });
            }

            window.dispatchEvent(new CustomEvent<TransactionUpdatedEvent>("mpb:transaction", { detail: event }));
        });

        if (canProcess) {
            echo.private("backoffice.transactions").listen(".transaction.requested", (event: TransactionRequestedEvent) => {
                void queryClient.invalidateQueries({ queryKey: adminKeys.all });
                AppToast.info(`New ${label(event.transaction.type).toLowerCase()} request`, {
                    description: `${event.user?.name ?? "A player"} · ${formatMoney(event.transaction.amount)} via ${(event.transaction.method ?? "").toUpperCase()}`,
                });
            });
        }

        return () => {
            echo.disconnect();
        };
    }, [status, token, userId, canProcess, queryClient]);

    return null;
}

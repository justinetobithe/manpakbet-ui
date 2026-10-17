"use client";

import { Eye, EyeOff, Plus, RefreshCw } from "lucide-react";
import { AppAmount } from "@/components/app";
import { useWallet } from "@/lib/WalletAPI";
import { cn } from "@/lib/utils";
import { useUiStore, useWalletStore } from "@/stores";

export default function WalletChip({ className }: { className?: string }) {
    const { data, isFetching, refetch } = useWallet();
    const hidden = useWalletStore((state) => state.hideBalance);
    const toggleHidden = useWalletStore((state) => state.toggleHideBalance);
    const openWallet = useUiStore((state) => state.openWallet);

    return (
        <div className={cn("flex items-center rounded-2xl border border-border bg-fg/5 p-1 pl-3", className)}>
            <div className="flex items-center gap-1.5">
                <span className="hidden text-[10px] font-bold tracking-wider text-muted-foreground uppercase xl:inline">Balance</span>
                <AppAmount value={data?.balance} className="text-sm font-bold text-gold-200" />
                <button
                    type="button"
                    onClick={toggleHidden}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-fg/10 hover:text-foreground"
                    aria-label={hidden ? "Show balance" : "Hide balance"}
                >
                    {hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                </button>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="hidden size-7 place-items-center rounded-lg text-muted-foreground transition hover:bg-fg/10 hover:text-foreground sm:grid"
                    aria-label="Refresh balance"
                >
                    <RefreshCw className={cn("size-3.5", isFetching && "animate-spin")} />
                </button>
            </div>
            <button
                type="button"
                onClick={() => openWallet("deposit")}
                className="bg-gold ring-gold ml-1 inline-flex h-8 items-center gap-1 rounded-xl px-2.5 text-xs font-bold text-[#2a1600] transition hover:brightness-110 sm:px-3"
            >
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">Deposit</span>
            </button>
        </div>
    );
}

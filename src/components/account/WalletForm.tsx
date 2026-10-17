"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDownToLine, ArrowUpFromLine, BadgeCheck, CheckCircle2, QrCode, ShieldAlert } from "lucide-react";
import { AppAmount, AppButton, AppTextField, AppToast } from "@/components/app";
import { paymentMethods } from "@/config/site";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { formatMoney } from "@/lib/format";
import { useDeposit, usePayoutAccounts, useWallet, useWithdraw } from "@/lib/WalletAPI";
import { PayoutAccountPicker } from "./PayoutAccounts";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/stores";
import type { WalletTab } from "@/stores/useUiStore";
import type { PaymentMethod } from "@/types/Wallet";

const QUICK_AMOUNTS = [100, 300, 500, 1000, 3000, 5000];

type WalletFormProps = {
    tab: WalletTab;
    onTabChange: (tab: WalletTab) => void;
    onDone?: () => void;
    compact?: boolean;
};

export default function WalletForm({ tab, onTabChange, onDone }: WalletFormProps) {
    const { data: wallet } = useWallet();
    const minDeposit = wallet?.limits.min_deposit ?? 100;
    const minWithdraw = wallet?.limits.min_withdraw ?? 200;
    const balance = wallet?.balance ?? 0;
    const preferredMethod = useWalletStore((state) => state.preferredMethod);
    const setPreferredMethod = useWalletStore((state) => state.setPreferredMethod);
    const allowedMethods = wallet?.limits.methods ?? paymentMethods.map((method) => method.id);
    const selectedMethod: PaymentMethod = allowedMethods.includes(preferredMethod) ? preferredMethod : (allowedMethods[0] ?? "gcash");
    const kycBlocked = tab === "withdraw" && Boolean(wallet?.require_kyc_for_withdraw) && wallet?.kyc_status !== "verified";
    const deposit = useDeposit();
    const withdraw = useWithdraw();
    const [submitted, setSubmitted] = React.useState<string | null>(null);
    const router = useRouter();
    const payoutAccounts = usePayoutAccounts(tab === "withdraw");
    const [chosenAccount, setChosenAccount] = React.useState<number | null>(null);
    const [accountError, setAccountError] = React.useState<string | undefined>();
    const usableAccounts = (payoutAccounts.data ?? []).filter((account) => allowedMethods.includes(account.method));
    const payoutAccountId =
        usableAccounts.find((account) => account.id === chosenAccount)?.id ?? usableAccounts.find((account) => account.is_default)?.id ?? usableAccounts[0]?.id ?? null;

    const schema = React.useMemo(
        () =>
            z
                .object({
                    amount: z.coerce.number<string>({ message: "Enter an amount" }).positive("Enter an amount"),
                })
                .superRefine((value, ctx) => {
                    const min = tab === "deposit" ? minDeposit : minWithdraw;
                    if (value.amount < min) ctx.addIssue({ code: "custom", path: ["amount"], message: `Minimum is ${formatMoney(min)}` });
                    if (tab === "withdraw") {
                        if (value.amount > balance) ctx.addIssue({ code: "custom", path: ["amount"], message: "Amount exceeds your balance" });
                    }
                }),
        [tab, minDeposit, minWithdraw, balance]
    );

    const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { amount: "" },
    });

    const amountValue = useWatch({ control: form.control, name: "amount" });
    const [prevTab, setPrevTab] = React.useState(tab);

    if (prevTab !== tab) {
        setPrevTab(tab);
        setSubmitted(null);
        setAccountError(undefined);
    }

    React.useEffect(() => {
        form.reset({ amount: "" });
    }, [tab, form]);

    const mutation = tab === "deposit" ? deposit : withdraw;

    const submit = form.handleSubmit(async (values) => {
        if (tab === "withdraw" && !payoutAccountId) {
            setAccountError("Select a payout account");
            return;
        }

        const checkoutTab = tab === "deposit" ? window.open("about:blank", "_blank") : null;

        try {
            const response =
                tab === "withdraw" && payoutAccountId
                    ? await withdraw.mutateAsync({ amount: values.amount, payout_account_id: payoutAccountId })
                    : await deposit.mutateAsync({ amount: values.amount, method: selectedMethod });
            if (tab === "deposit") {
                const url = `/pay/${response.data.reference}`;
                onDone?.();
                if (checkoutTab && !checkoutTab.closed) {
                    checkoutTab.location.href = url;
                    AppToast.success("Complete your payment in the new tab", { description: "Your balance updates here automatically once it's received." });
                } else {
                    router.push(url);
                }
                return;
            }
            AppToast.success(response.message);
            setSubmitted(response.data.reference);
        } catch (err) {
            checkoutTab?.close();
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => (key === "payout_account_id" ? setAccountError(message) : form.setError(key as "amount", { message })));
            AppToast.error(tab === "deposit" ? "Deposit failed" : "Withdrawal failed", { description: apiError(err) });
        }
    });

    if (submitted) {
        return (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-success/15 text-jade-400 ring-1 ring-success/30">
                    <CheckCircle2 className="size-8" />
                </div>
                <div>
                    <div className="font-display text-xl font-extrabold">Request submitted</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Reference <span className="font-mono font-bold text-gold-200">{submitted}</span>. We&apos;ll notify you once it&apos;s processed.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AppButton tone="surface" onClick={() => setSubmitted(null)}>
                        New request
                    </AppButton>
                    {onDone ? <AppButton onClick={onDone}>Done</AppButton> : null}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-fg/5 p-1">
                {(["deposit", "withdraw"] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onTabChange(item)}
                        className={cn(
                            "inline-flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-bold capitalize transition",
                            tab === item ? (item === "deposit" ? "bg-gold text-[#2a1600]" : "bg-ember text-white") : "text-foreground/65 hover:text-foreground"
                        )}
                    >
                        {item === "deposit" ? <ArrowDownToLine className="size-4" /> : <ArrowUpFromLine className="size-4" />}
                        {item}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-linear-to-r from-plum-700/60 to-plum-850 px-4 py-3">
                <div>
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Available balance</div>
                    <AppAmount value={balance} countUp respectPrivacy={false} className="font-display text-xl font-extrabold text-gold-200" />
                </div>
                {wallet?.pending_withdrawals ? (
                    <div className="text-right text-xs text-muted-foreground">
                        Pending payout
                        <div className="font-bold text-amber-300">{formatMoney(wallet.pending_withdrawals)}</div>
                    </div>
                ) : null}
            </div>

            {kycBlocked ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-5 text-center">
                    <ShieldAlert className="size-8 text-amber-300" />
                    <div>
                        <div className="font-display text-lg font-extrabold">{wallet?.kyc_status === "pending" ? "Verification in review" : "Verify your identity to withdraw"}</div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {wallet?.kyc_status === "pending"
                                ? "We're reviewing your documents. Withdrawals unlock as soon as you're verified."
                                : "For your security, withdrawals require a verified account. It only takes a few minutes."}
                        </p>
                    </div>
                    {wallet?.kyc_status !== "pending" ? (
                        <AppButton asChild onClick={onDone}>
                            <Link href="/account/verification">
                                <BadgeCheck /> Verify now
                            </Link>
                        </AppButton>
                    ) : null}
                </div>
            ) : (
            <form onSubmit={submit} className="space-y-4" noValidate>
                {tab === "withdraw" ? (
                    <PayoutAccountPicker
                        value={payoutAccountId}
                        methods={allowedMethods}
                        error={accountError}
                        onChange={(id) => {
                            setChosenAccount(id);
                            setAccountError(undefined);
                        }}
                    />
                ) : (
                <div>
                    <div className="mb-2 text-xs font-semibold text-foreground/80">Payment channel</div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {paymentMethods.filter((method) => !wallet || wallet.limits.methods.includes(method.id)).map((method) => {
                            const active = selectedMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPreferredMethod(method.id as PaymentMethod)}
                                    aria-pressed={active}
                                    className={cn(
                                        "relative flex items-center gap-2.5 rounded-2xl border p-2 text-left transition sm:gap-3 sm:p-2.5",
                                        active ? "border-gold-400/70 bg-gold-400/10 ring-2 ring-gold-400/25" : "border-border bg-fg/3 hover:border-fg/25"
                                    )}
                                >
                                    <img src={method.logo} alt="" className={cn("size-10 shrink-0 rounded-xl bg-white object-contain p-1 sm:size-11", active && `ring-2 ${method.ring}`)} />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-bold">{method.label}</span>
                                        <span className="hidden truncate text-[11px] text-muted-foreground sm:block">{method.hint}</span>
                                    </span>
                                    {active ? <CheckCircle2 className="absolute top-2 right-2 size-4 text-gold-300" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
                )}

                {tab === "deposit" ? (
                    <p className="flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/8 px-3 py-2.5 text-xs text-foreground/80">
                        <QrCode className="size-4 shrink-0 text-gold-300" />
                        After you continue, we&apos;ll show a QR code to scan with your e-wallet.
                    </p>
                ) : null}

                <AppTextField control={form.control} name="amount" label="Amount" type="number" inputMode="decimal" prefix="₱" placeholder={String(tab === "deposit" ? minDeposit : minWithdraw)} />

                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                    {QUICK_AMOUNTS.map((amount) => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => form.setValue("amount", String(amount), { shouldValidate: true })}
                            className={cn(
                                "h-9 rounded-full border px-3 text-xs font-bold transition",
                                String(amountValue) === String(amount) ? "border-gold-400/60 bg-gold-400/15 text-gold-200" : "border-border text-foreground/70 hover:border-fg/25"
                            )}
                        >
                            ₱{amount.toLocaleString()}
                        </button>
                    ))}
                </div>

                <AppButton type="submit" size="lg" block shine tone={tab === "deposit" ? "gold" : "ember"} loading={mutation.isPending} disabled={tab === "withdraw" && !payoutAccountId}>
                    {tab === "deposit" ? "Continue to payment" : "Request withdrawal"}
                </AppButton>
                <p className="text-center text-xs text-muted-foreground">
                    {tab === "deposit"
                        ? `Minimum deposit ${formatMoney(minDeposit)}. Credits are added once payment is verified.`
                        : `Minimum withdrawal ${formatMoney(minWithdraw)}. Funds are held until the payout is processed.`}
                </p>
            </form>
            )}
        </div>
    );
}

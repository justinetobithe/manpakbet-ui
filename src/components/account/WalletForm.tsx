"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowDownToLine, ArrowUpFromLine, CheckCircle2 } from "lucide-react";
import { AppAmount, AppButton, AppTextField, AppToast } from "@/components/app";
import { paymentMethods } from "@/config/site";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { formatMoney } from "@/lib/format";
import { useDeposit, useWallet, useWithdraw } from "@/lib/WalletAPI";
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

export default function WalletForm({ tab, onTabChange, onDone, compact }: WalletFormProps) {
    const { data: wallet } = useWallet();
    const minDeposit = wallet?.limits.min_deposit ?? 100;
    const minWithdraw = wallet?.limits.min_withdraw ?? 200;
    const balance = wallet?.balance ?? 0;
    const preferredMethod = useWalletStore((state) => state.preferredMethod);
    const setPreferredMethod = useWalletStore((state) => state.setPreferredMethod);
    const selectedMethod: PaymentMethod = paymentMethods.some((method) => method.id === preferredMethod) ? preferredMethod : "gcash";
    const savedName = useWalletStore((state) => state.savedAccountName);
    const savedNumber = useWalletStore((state) => state.savedAccountNumber);
    const rememberAccount = useWalletStore((state) => state.rememberAccount);
    const deposit = useDeposit();
    const withdraw = useWithdraw();
    const [submitted, setSubmitted] = React.useState<string | null>(null);

    const schema = React.useMemo(
        () =>
            z
                .object({
                    amount: z.coerce.number<string>({ message: "Enter an amount" }).positive("Enter an amount"),
                    account_name: z.string().trim().max(100),
                    account_number: z.string().trim().max(50),
                })
                .superRefine((value, ctx) => {
                    const min = tab === "deposit" ? minDeposit : minWithdraw;
                    if (value.amount < min) ctx.addIssue({ code: "custom", path: ["amount"], message: `Minimum is ${formatMoney(min)}` });
                    if (tab === "withdraw") {
                        if (value.amount > balance) ctx.addIssue({ code: "custom", path: ["amount"], message: "Amount exceeds your balance" });
                        if (!value.account_name) ctx.addIssue({ code: "custom", path: ["account_name"], message: "Account name is required" });
                        if (!value.account_number) ctx.addIssue({ code: "custom", path: ["account_number"], message: "Account number is required" });
                    }
                }),
        [tab, minDeposit, minWithdraw, balance]
    );

    const form = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { amount: "", account_name: savedName, account_number: savedNumber },
    });

    const amountValue = useWatch({ control: form.control, name: "amount" });
    const [prevTab, setPrevTab] = React.useState(tab);

    if (prevTab !== tab) {
        setPrevTab(tab);
        setSubmitted(null);
    }

    React.useEffect(() => {
        form.reset({ amount: "", account_name: savedName, account_number: savedNumber });
    }, [tab, savedName, savedNumber, form]);

    const mutation = tab === "deposit" ? deposit : withdraw;

    const submit = form.handleSubmit(async (values) => {
        try {
            const response = await mutation.mutateAsync({
                amount: values.amount,
                method: selectedMethod,
                account_name: values.account_name || undefined,
                account_number: values.account_number || undefined,
            });
            if (values.account_name && values.account_number) rememberAccount(values.account_name, values.account_number);
            setSubmitted(response.data.reference);
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as "amount", { message }));
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
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-black/30 p-1">
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
                    <AppAmount value={balance} respectPrivacy={false} className="font-display text-xl font-extrabold text-gold-200" />
                </div>
                {wallet?.pending_withdrawals ? (
                    <div className="text-right text-xs text-muted-foreground">
                        Pending payout
                        <div className="font-bold text-amber-300">{formatMoney(wallet.pending_withdrawals)}</div>
                    </div>
                ) : null}
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                    <div className="mb-2 text-xs font-semibold text-foreground/80">Payment channel</div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {paymentMethods.map((method) => {
                            const active = selectedMethod === method.id;
                            return (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => setPreferredMethod(method.id as PaymentMethod)}
                                    aria-pressed={active}
                                    className={cn(
                                        "relative flex items-center gap-3 rounded-2xl border p-2.5 text-left transition",
                                        active ? "border-gold-400/70 bg-gold-400/10 ring-2 ring-gold-400/25" : "border-border bg-white/3 hover:border-white/25"
                                    )}
                                >
                                    <img src={method.logo} alt="" className={cn("size-11 shrink-0 rounded-xl bg-white object-contain p-1", active && `ring-2 ${method.ring}`)} />
                                    <span className="min-w-0">
                                        <span className="block text-sm font-bold">{method.label}</span>
                                        <span className="block truncate text-[11px] text-muted-foreground">{method.hint}</span>
                                    </span>
                                    {active ? <CheckCircle2 className="absolute top-2 right-2 size-4 text-gold-300" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AppTextField control={form.control} name="amount" label="Amount" type="number" inputMode="decimal" prefix="₱" placeholder={String(tab === "deposit" ? minDeposit : minWithdraw)} />

                <div className="flex flex-wrap gap-2">
                    {QUICK_AMOUNTS.map((amount) => (
                        <button
                            key={amount}
                            type="button"
                            onClick={() => form.setValue("amount", String(amount), { shouldValidate: true })}
                            className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-bold transition",
                                String(amountValue) === String(amount) ? "border-gold-400/60 bg-gold-400/15 text-gold-200" : "border-border text-foreground/70 hover:border-white/25"
                            )}
                        >
                            ₱{amount.toLocaleString()}
                        </button>
                    ))}
                </div>

                <div className={cn("grid gap-3", !compact && "sm:grid-cols-2")}>
                    <AppTextField control={form.control} name="account_name" label={tab === "deposit" ? "Sender name (optional)" : "Account name"} placeholder="Juan Dela Cruz" />
                    <AppTextField control={form.control} name="account_number" label={tab === "deposit" ? "Sender number (optional)" : "Account / mobile number"} placeholder="0917 123 4567" inputMode="tel" />
                </div>

                <AppButton type="submit" size="lg" block shine tone={tab === "deposit" ? "gold" : "ember"} loading={mutation.isPending}>
                    {tab === "deposit" ? "Submit deposit" : "Request withdrawal"}
                </AppButton>
                <p className="text-center text-xs text-muted-foreground">
                    {tab === "deposit"
                        ? `Minimum deposit ${formatMoney(minDeposit)}. Credits are added once payment is verified.`
                        : `Minimum withdrawal ${formatMoney(minWithdraw)}. Funds are held until the payout is processed.`}
                </p>
            </form>
        </div>
    );
}

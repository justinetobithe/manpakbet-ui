"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Plus, ShieldCheck, Star, Trash2, WalletCards } from "lucide-react";
import { AppBadge, AppButton, AppConfirm, AppDialog, AppEmpty, AppSwitchField, AppTextField, AppToast } from "@/components/app";
import { paymentMethods } from "@/config/site";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import { useAddPayoutAccount, useDeletePayoutAccount, usePayoutAccounts, useUpdatePayoutAccount } from "@/lib/WalletAPI";
import type { PaymentMethod, PayoutAccount } from "@/types/Wallet";

const methodInfo = (method: PaymentMethod) => paymentMethods.find((item) => item.id === method) ?? paymentMethods[0];

const normalizeNumber = (value: string) => {
    const digits = value.replace(/\D+/g, "");
    if (digits.startsWith("63") && digits.length === 12) return `0${digits.slice(2)}`;
    if (digits.startsWith("9") && digits.length === 10) return `0${digits}`;
    return digits;
};

const schema = z.object({
    account_name: z.string().trim().min(2, "Enter the registered account name").max(100),
    account_number: z
        .string()
        .trim()
        .refine((value) => /^09\d{9}$/.test(normalizeNumber(value)), "Enter a valid 11-digit mobile number starting with 09"),
    is_default: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

type AddDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    methods?: PaymentMethod[];
    defaultMethod?: PaymentMethod;
    onSaved?: (account: PayoutAccount) => void;
};

export function PayoutAccountDialog({ open, onOpenChange, methods, defaultMethod, onSaved }: AddDialogProps) {
    const available = paymentMethods.filter((item) => !methods || methods.includes(item.id));
    const [method, setMethod] = React.useState<PaymentMethod>(defaultMethod ?? available[0]?.id ?? "gcash");
    const add = useAddPayoutAccount();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { account_name: "", account_number: "", is_default: false },
    });
    const close = (next: boolean) => {
        if (!next) form.reset({ account_name: "", account_number: "", is_default: false });
        onOpenChange(next);
    };

    const submit = form.handleSubmit(async (values) => {
        try {
            const response = await add.mutateAsync({
                method,
                account_name: values.account_name,
                account_number: normalizeNumber(values.account_number),
                is_default: values.is_default,
            });
            AppToast.success(response.message);
            if (response.data) onSaved?.(response.data);
            close(false);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as keyof FormValues, { message }));
            AppToast.error("Could not save account", { description: apiError(err) });
        }
    });

    return (
        <AppDialog
            open={open}
            onOpenChange={close}
            size="sm"
            title="Add payout account"
            description="Withdrawals are sent only to accounts saved here."
            footer={
                <>
                    <AppButton tone="ghost" onClick={() => close(false)} disabled={add.isPending}>
                        Cancel
                    </AppButton>
                    <AppButton onClick={submit} loading={add.isPending} leftIcon={<Plus />}>
                        Save account
                    </AppButton>
                </>
            }
        >
            <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                    <div className="mb-2 text-xs font-semibold text-foreground/80">E-wallet</div>
                    <div className="grid grid-cols-2 gap-2.5">
                        {available.map((item) => {
                            const active = method === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setMethod(item.id)}
                                    aria-pressed={active}
                                    className={cn(
                                        "relative flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition",
                                        active ? "border-gold-400/70 bg-gold-400/10 ring-2 ring-gold-400/25" : "border-border bg-fg/3 hover:border-fg/25"
                                    )}
                                >
                                    <img src={item.logo} alt="" className="size-10 shrink-0 rounded-xl bg-white object-contain p-1" />
                                    <span className="text-sm font-bold">{item.label}</span>
                                    {active ? <CheckCircle2 className="absolute top-2 right-2 size-4 text-gold-300" /> : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <AppTextField control={form.control} name="account_name" label="Account name" placeholder="Juan Dela Cruz" autoComplete="name" />
                <AppTextField control={form.control} name="account_number" label="Mobile number" placeholder="0917 123 4567" inputMode="tel" autoComplete="tel" />
                <AppSwitchField control={form.control} name="is_default" label="Set as default" hint="Pre-selected every time you withdraw" />
                <p className="flex items-start gap-2 text-[11px] text-muted-foreground">
                    <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-jade-400" />
                    The name must match your verified identity. Saved numbers are always shown masked.
                </p>
            </form>
        </AppDialog>
    );
}

type CardProps = {
    account: PayoutAccount;
    selected?: boolean;
    onSelect?: () => void;
    actions?: React.ReactNode;
    disabled?: boolean;
};

export function PayoutAccountCard({ account, selected, onSelect, actions, disabled }: CardProps) {
    const info = methodInfo(account.method);
    const Wrapper = onSelect ? "button" : "div";

    return (
        <Wrapper
            {...(onSelect ? { type: "button" as const, onClick: onSelect, "aria-pressed": selected, disabled } : {})}
            className={cn(
                "relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition",
                selected ? "border-gold-400/70 bg-gold-400/10 ring-2 ring-gold-400/25" : "border-border bg-fg/3",
                onSelect && !selected && "hover:border-fg/25",
                disabled && "cursor-not-allowed opacity-50"
            )}
        >
            <img src={info.logo} alt={info.label} className="size-11 shrink-0 rounded-xl bg-white object-contain p-1" />
            <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-bold">{account.account_name}</span>
                    {account.is_default ? (
                        <AppBadge tone="gold" size="sm">
                            <Star className="fill-current" /> Default
                        </AppBadge>
                    ) : null}
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/70">{info.label}</span>
                    <span className="font-mono tracking-wider">{account.masked_account_number}</span>
                </span>
            </span>
            {actions}
            {onSelect ? (
                <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", selected ? "border-gold-400 bg-gold-400 text-[#2a1600]" : "border-fg/25")}>
                    {selected ? <CheckCircle2 className="size-3.5" /> : null}
                </span>
            ) : null}
        </Wrapper>
    );
}

export function PayoutAccountManager() {
    const { data: accounts, isLoading } = usePayoutAccounts();
    const update = useUpdatePayoutAccount();
    const remove = useDeletePayoutAccount();
    const [adding, setAdding] = React.useState(false);
    const [deleting, setDeleting] = React.useState<PayoutAccount | null>(null);

    const makeDefault = async (account: PayoutAccount) => {
        try {
            const response = await update.mutateAsync({ id: account.id, is_default: true });
            AppToast.success(response.message);
        } catch (err) {
            AppToast.error("Could not update account", { description: apiError(err) });
        }
    };

    const confirmDelete = async () => {
        if (!deleting) return;
        try {
            const response = await remove.mutateAsync(deleting.id);
            AppToast.success(response.message);
            setDeleting(null);
        } catch (err) {
            AppToast.error("Could not remove account", { description: apiError(err) });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">Withdrawals can only be sent to accounts saved here.</p>
                <AppButton leftIcon={<Plus />} onClick={() => setAdding(true)}>
                    Add account
                </AppButton>
            </div>

            {isLoading ? (
                <div className="grid gap-2.5 sm:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="h-[70px] animate-pulse rounded-2xl bg-fg/5" />
                    ))}
                </div>
            ) : accounts?.length ? (
                <div className="grid gap-2.5 sm:grid-cols-2">
                    {accounts.map((account) => (
                        <PayoutAccountCard
                            key={account.id}
                            account={account}
                            actions={
                                <span className="flex shrink-0 items-center gap-1">
                                    {!account.is_default ? (
                                        <AppButton tone="ghost" size="xs" onClick={() => makeDefault(account)} disabled={update.isPending}>
                                            Set default
                                        </AppButton>
                                    ) : null}
                                    <AppButton tone="ghost" size="icon-sm" aria-label="Remove account" onClick={() => setDeleting(account)}>
                                        <Trash2 className="text-red-300" />
                                    </AppButton>
                                </span>
                            }
                        />
                    ))}
                </div>
            ) : (
                <AppEmpty
                    compact
                    icon={<WalletCards />}
                    title="No payout accounts yet"
                    description="Add a GCash or Maya account. You'll need one to request a withdrawal."
                    action={
                        <AppButton leftIcon={<Plus />} onClick={() => setAdding(true)}>
                            Add account
                        </AppButton>
                    }
                />
            )}

            <PayoutAccountDialog open={adding} onOpenChange={setAdding} />
            <AppConfirm
                open={Boolean(deleting)}
                onOpenChange={(open) => !open && setDeleting(null)}
                title="Remove payout account?"
                description={deleting ? `${methodInfo(deleting.method).label} ${deleting.masked_account_number} will no longer be available for withdrawals.` : undefined}
                confirmLabel="Remove"
                loading={remove.isPending}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

type PickerProps = {
    value: number | null;
    onChange: (id: number | null) => void;
    methods?: PaymentMethod[];
    error?: string;
};

export function PayoutAccountPicker({ value, onChange, methods, error }: PickerProps) {
    const { data: accounts, isLoading } = usePayoutAccounts();
    const [adding, setAdding] = React.useState(false);
    const usable = (accounts ?? []).filter((account) => !methods || methods.includes(account.method));
    const selected = value;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground/80">
                    Send payout to <span className="text-red-300">*</span>
                </span>
                {usable.length ? (
                    <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-gold-300 hover:underline">
                        <Plus className="size-3.5" /> Add account
                    </button>
                ) : null}
            </div>

            {isLoading ? (
                <div className="h-[70px] animate-pulse rounded-2xl bg-fg/5" />
            ) : usable.length ? (
                <div className="space-y-2" role="radiogroup" aria-label="Payout account">
                    {usable.map((account) => (
                        <PayoutAccountCard key={account.id} account={account} selected={selected === account.id} onSelect={() => onChange(account.id)} />
                    ))}
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border border-dashed p-4 text-left transition hover:border-gold-400/60 hover:bg-gold-400/5",
                        error ? "border-destructive/60" : "border-fg/25"
                    )}
                >
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold-400/15 text-gold-300">
                        <Plus className="size-5" />
                    </span>
                    <span>
                        <span className="block text-sm font-bold">Add a payout account</span>
                        <span className="block text-xs text-muted-foreground">Save your GCash or Maya number to withdraw</span>
                    </span>
                </button>
            )}

            {error ? <p className="text-xs font-medium text-red-300">{error}</p> : null}

            <PayoutAccountDialog open={adding} onOpenChange={setAdding} methods={methods} onSaved={(account) => onChange(account.id)} />
        </div>
    );
}

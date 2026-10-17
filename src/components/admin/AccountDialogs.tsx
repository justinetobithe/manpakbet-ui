"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppAmount, AppButton, AppDialog, AppSelectField, AppSwitchField, AppTextField, AppToast } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import { useAdjustBalance, useRoles, useSaveAdminRecord } from "@/lib/AdminAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { titleCase } from "@/lib/format";
import type { User } from "@/types/User";

const balanceSchema = z.object({
    amount: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Enter an amount like 500 or -250"),
    notes: z.string().max(255),
});

type BalanceValues = z.infer<typeof balanceSchema>;

export function BalanceDialog({ user, onClose, onDone }: { user: Pick<User, "id" | "name" | "balance"> | null; onClose: () => void; onDone?: () => void }) {
    const adjust = useAdjustBalance();
    const form = useForm<BalanceValues>({ resolver: zodResolver(balanceSchema), defaultValues: { amount: "", notes: "" } });

    React.useEffect(() => {
        if (user) form.reset({ amount: "", notes: "" });
    }, [user, form]);

    const submit = form.handleSubmit(async (values) => {
        if (!user) return;
        try {
            const response = await adjust.mutateAsync({ id: user.id, amount: Number(values.amount), notes: values.notes || undefined });
            AppToast.success(response.message);
            onDone?.();
            onClose();
        } catch (err) {
            AppToast.error("Adjustment failed", { description: apiError(err) });
        }
    });

    return (
        <AppDialog
            open={Boolean(user)}
            onOpenChange={(open) => (!open ? onClose() : undefined)}
            size="sm"
            title="Adjust balance"
            description={user ? `${user.name} · current balance` : undefined}
            footer={
                <>
                    <AppButton tone="ghost" onClick={onClose}>
                        Cancel
                    </AppButton>
                    <AppButton onClick={submit} loading={adjust.isPending}>
                        Apply
                    </AppButton>
                </>
            }
        >
            <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="rounded-xl border border-border bg-fg/3 p-3 text-center">
                    <AppAmount value={user?.balance} respectPrivacy={false} className="font-display text-2xl font-extrabold text-gold-200" />
                </div>
                <AppTextField control={form.control} name="amount" label="Amount" prefix="₱" inputMode="decimal" hint="Use a negative value to deduct" />
                <AppTextField control={form.control} name="notes" label="Reason" placeholder="e.g. Goodwill credit" />
            </form>
        </AppDialog>
    );
}

const accountSchema = z.object({
    first_name: z.string().trim().max(100),
    last_name: z.string().trim().max(100),
    email: z.union([z.literal(""), z.email("Enter a valid email")]),
    phone: z.string().max(20),
    role: z.string().min(1, "Choose a role"),
    password: z.string(),
    is_active: z.boolean(),
});

type AccountValues = z.infer<typeof accountSchema>;

export function AccountFormDialog({ open, onOpenChange, account, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; account?: User | null; onSaved?: (user: User) => void }) {
    const { can } = useAuth();
    const { data: roles } = useRoles(can("roles.manage"));
    const save = useSaveAdminRecord<User>("users");
    const editing = Boolean(account);
    const form = useForm<AccountValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: { first_name: "", last_name: "", email: "", phone: "", role: "user", password: "", is_active: true },
    });

    React.useEffect(() => {
        if (!open) return;
        form.reset(
            account
                ? {
                      first_name: account.first_name ?? "",
                      last_name: account.last_name ?? "",
                      email: account.email ?? "",
                      phone: account.phone ?? "",
                      role: account.role,
                      password: "",
                      is_active: account.is_active,
                  }
                : { first_name: "", last_name: "", email: "", phone: "", role: "user", password: "", is_active: true }
        );
    }, [open, account, form]);

    const roleOptions = (roles?.roles.map((role) => role.name) ?? ["user", "staff", "admin"]).map((name) => ({ label: titleCase(name), value: name }));

    const submit = form.handleSubmit(async (values) => {
        if (!editing && values.password.length < 6) {
            form.setError("password", { message: "At least 6 characters" });
            return;
        }
        if (editing && values.password && values.password.length < 6) {
            form.setError("password", { message: "At least 6 characters" });
            return;
        }

        try {
            const response = await save.mutateAsync({
                id: account?.id,
                payload: {
                    ...values,
                    first_name: values.first_name || null,
                    last_name: values.last_name || null,
                    email: values.email || null,
                    phone: values.phone || null,
                    password: values.password || null,
                },
            });
            AppToast.success(response.message);
            onSaved?.(response.data);
            onOpenChange(false);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as keyof AccountValues, { message }));
            AppToast.error("Could not save account", { description: apiError(err) });
        }
    });

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            size="lg"
            title={editing ? "Edit account" : "New account"}
            description={editing ? "Update profile, role and access." : "Create a player or back-office account."}
            footer={
                <>
                    <AppButton tone="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </AppButton>
                    <AppButton onClick={submit} loading={save.isPending}>
                        {editing ? "Save changes" : "Create account"}
                    </AppButton>
                </>
            }
        >
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
                <AppTextField control={form.control} name="first_name" label="First name" />
                <AppTextField control={form.control} name="last_name" label="Last name" />
                <AppTextField control={form.control} name="email" label="Email" type="email" />
                <AppTextField control={form.control} name="phone" label="Mobile" placeholder="639171234567" />
                <AppSelectField control={form.control} name="role" label="Role" options={roleOptions} />
                <AppTextField control={form.control} name="password" label="Password" type="password" hint={editing ? "Leave blank to keep the current password" : "At least 6 characters"} />
                <AppSwitchField control={form.control} name="is_active" label="Account active" hint="Suspended accounts are signed out immediately" className="sm:col-span-2" />
            </form>
        </AppDialog>
    );
}

"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins, Users } from "lucide-react";
import { AppAmount, AppBadge, AppButton, AppDialog, AppTextField, AppToast } from "@/components/app";
import ResourceManager, { type ResourceConfig } from "@/components/admin/ResourceManager";
import { DateCell, StatusCell } from "@/components/admin/cells";
import { useAuth } from "@/hooks/useAuth";
import { useAdjustBalance, useRoles } from "@/lib/AdminAPI";
import apiError from "@/lib/apiError";
import { initials, timeAgo, titleCase } from "@/lib/format";
import type { User } from "@/types/User";

const schema = z.object({
    first_name: z.string().trim().max(100),
    last_name: z.string().trim().max(100),
    email: z.union([z.literal(""), z.email("Enter a valid email")]),
    phone: z.string().max(20),
    role: z.string().min(1, "Choose a role"),
    password: z.string().refine((value) => !value || value.length >= 6, "At least 6 characters"),
    is_active: z.boolean(),
});

const balanceSchema = z.object({
    amount: z.string().regex(/^-?\d+(\.\d{1,2})?$/, "Enter an amount like 500 or -250"),
    notes: z.string().max(255),
});

type BalanceValues = z.infer<typeof balanceSchema>;

function BalanceDialog({ user, onClose }: { user: User | null; onClose: () => void }) {
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
                <div className="rounded-xl border border-border bg-white/3 p-3 text-center">
                    <AppAmount value={user?.balance} respectPrivacy={false} className="font-display text-2xl font-extrabold text-gold-200" />
                </div>
                <AppTextField control={form.control} name="amount" label="Amount" prefix="₱" inputMode="decimal" hint="Use a negative value to deduct" />
                <AppTextField control={form.control} name="notes" label="Reason" placeholder="e.g. Goodwill credit" />
            </form>
        </AppDialog>
    );
}

export default function AdminUsersPage() {
    const { can, user: me } = useAuth();
    const { data: roles } = useRoles(can("roles.manage"));
    const [balanceUser, setBalanceUser] = React.useState<User | null>(null);

    const roleOptions = (roles?.roles.map((role) => role.name) ?? ["user", "staff", "admin"]).map((name) => ({ label: titleCase(name), value: name }));

    const config: ResourceConfig<User> = {
        resource: "users",
        title: "Players & Staff",
        singular: "User",
        description: "Accounts, roles, access and balances.",
        icon: <Users />,
        permission: "users.manage",
        schema,
        defaults: { first_name: "", last_name: "", email: "", phone: "", role: "user", password: "", is_active: true },
        toForm: (user) => ({
            first_name: user.first_name ?? "",
            last_name: user.last_name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            role: user.role,
            password: "",
            is_active: user.is_active,
        }),
        toPayload: (values) => ({
            ...values,
            first_name: values.first_name || null,
            last_name: values.last_name || null,
            email: values.email || null,
            phone: values.phone || null,
            password: values.password || null,
        }),
        optionSources: { roles: roleOptions },
        filters: [
            { key: "role", label: "Role", options: roleOptions },
            {
                key: "is_active",
                label: "Status",
                options: [
                    { label: "Active", value: "1" },
                    { label: "Suspended", value: "0" },
                ],
            },
        ],
        searchPlaceholder: "Search name, email or phone…",
        fields: [
            { name: "first_name", label: "First name", type: "text" },
            { name: "last_name", label: "Last name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Mobile", type: "text", placeholder: "639171234567" },
            { name: "role", label: "Role", type: "select", optionsKey: "roles" },
            { name: "password", label: "Password", type: "password", hint: "Leave blank to keep the current password" },
            { name: "is_active", label: "Account active", type: "switch", hint: "Suspended users are signed out immediately", span: 2 },
        ],
        columns: [
            {
                accessorKey: "first_name",
                header: "User",
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-linear-to-br from-plum-600 to-plum-700 text-xs font-bold">{initials(row.original.name)}</span>
                        <div className="min-w-0">
                            <div className="max-w-[200px] truncate font-semibold">{row.original.name}</div>
                            <div className="max-w-[200px] truncate text-xs text-muted-foreground">{row.original.email ?? row.original.phone}</div>
                        </div>
                    </div>
                ),
            },
            {
                id: "role",
                header: "Role",
                enableSorting: false,
                cell: ({ row }) => (
                    <AppBadge size="sm" tone={row.original.role === "admin" ? "ember" : row.original.role === "staff" ? "violet" : "neutral"}>
                        {row.original.role}
                    </AppBadge>
                ),
            },
            { accessorKey: "balance", header: "Balance", meta: { align: "right" }, cell: ({ row }) => <AppAmount value={row.original.balance} respectPrivacy={false} className="font-semibold" /> },
            { accessorKey: "last_login_at", header: "Last seen", meta: { hideOnMobile: true }, cell: ({ row }) => <span className="text-muted-foreground">{timeAgo(row.original.last_login_at)}</span> },
            { accessorKey: "created_at", header: "Joined", meta: { hideOnMobile: true }, cell: ({ row }) => <DateCell value={row.original.created_at} /> },
            { accessorKey: "is_active", header: "Status", enableSorting: false, cell: ({ row }) => <StatusCell active={row.original.is_active} off="Suspended" /> },
        ],
        rowActions: (user) =>
            can("users.balance") ? (
                <AppButton tone="ghost" size="icon-sm" onClick={() => setBalanceUser(user)} aria-label="Adjust balance" className="text-gold-300">
                    <Coins />
                </AppButton>
            ) : null,
        canDelete: (user) => String(user.id) !== me?.id,
        renderMobileCard: (user) => (
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate font-semibold">{user.name}</div>
                    <div className="truncate text-xs text-muted-foreground">
                        {user.role} · <AppAmount value={user.balance} respectPrivacy={false} />
                    </div>
                </div>
                <StatusCell active={user.is_active} off="Suspended" />
            </div>
        ),
    };

    return (
        <>
            <ResourceManager config={config} />
            <BalanceDialog user={balanceUser} onClose={() => setBalanceUser(null)} />
        </>
    );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Lock, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AppBadge, AppButton, AppCard, AppConfirm, AppDialog, AppPageHeader, AppToast, inputClass } from "@/components/app";
import { useDeleteRole, useRoles, useSaveRole } from "@/lib/AdminAPI";
import { titleCase } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminRole, PermissionDefinition } from "@/types/Admin";

function PermissionGrid({ permissions, value, onChange, disabled }: { permissions: PermissionDefinition[]; value: string[]; onChange: (next: string[]) => void; disabled?: boolean }) {
    const groups = permissions.reduce<Record<string, PermissionDefinition[]>>((acc, permission) => {
        const group = permission.name.split(".")[0];
        (acc[group] ??= []).push(permission);
        return acc;
    }, {});

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(groups).map(([group, items]) => (
                <div key={group} className="rounded-xl border border-border bg-fg/2 p-3">
                    <div className="mb-2 text-[10px] font-bold tracking-[0.18em] text-gold-300/90 uppercase">{titleCase(group)}</div>
                    <div className="space-y-2">
                        {items.map((permission) => {
                            const checked = value.includes(permission.name);
                            return (
                                <label key={permission.name} className={cn("flex items-start gap-2.5 text-sm", disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer")}>
                                    <Checkbox
                                        checked={checked}
                                        disabled={disabled}
                                        onCheckedChange={(state) => onChange(state ? [...value, permission.name] : value.filter((item) => item !== permission.name))}
                                        className="mt-0.5 border-fg/30 data-[state=checked]:border-gold-400 data-[state=checked]:bg-gold-400 data-[state=checked]:text-[#2a1600]"
                                    />
                                    <span>
                                        <span className="block font-semibold">{permission.name}</span>
                                        <span className="block text-xs text-muted-foreground">{permission.description}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}

function RoleCard({ role, permissions, index }: { role: AdminRole; permissions: PermissionDefinition[]; index: number }) {
    const save = useSaveRole();
    const remove = useDeleteRole();
    const [value, setValue] = React.useState<string[]>(role.permissions);
    const [confirm, setConfirm] = React.useState(false);
    const locked = role.name === "admin";
    const dirty = value.slice().sort().join() !== role.permissions.slice().sort().join();

    const persist = async () => {
        try {
            const response = await save.mutateAsync({ id: role.id, permissions: value });
            AppToast.success(response.message, { description: titleCase(role.name) });
        } catch (err) {
            AppToast.apiError(err, "Could not update role");
        }
    };

    const destroy = async () => {
        try {
            const response = await remove.mutateAsync(role.id);
            AppToast.success(response.message);
            setConfirm(false);
        } catch (err) {
            AppToast.apiError(err, "Could not delete role");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <AppCard
                glow={locked}
                icon={locked ? <Lock /> : <ShieldCheck />}
                title={
                    <span className="flex items-center gap-2">
                        {titleCase(role.name)}
                        {role.is_protected ? (
                            <AppBadge size="sm" tone="neutral">
                                Built-in
                            </AppBadge>
                        ) : null}
                    </span>
                }
                description={
                    <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" /> {role.users_count} {role.users_count === 1 ? "member" : "members"} · {role.permissions.length} permissions
                    </span>
                }
                actions={
                    <>
                        {!role.is_protected ? (
                            <AppButton tone="ghost" size="icon-sm" className="text-red-300" onClick={() => setConfirm(true)} aria-label="Delete role">
                                <Trash2 />
                            </AppButton>
                        ) : null}
                        {!locked ? (
                            <AppButton size="sm" disabled={!dirty} loading={save.isPending} onClick={persist}>
                                Save
                            </AppButton>
                        ) : null}
                    </>
                }
            >
                {locked ? <p className="mb-3 text-xs text-muted-foreground">Administrators always hold every permission.</p> : null}
                <PermissionGrid permissions={permissions} value={value} onChange={setValue} disabled={locked} />
            </AppCard>
            <AppConfirm
                open={confirm}
                onOpenChange={setConfirm}
                title={`Delete the ${role.name} role?`}
                description="Members must be reassigned before a role can be removed."
                confirmLabel="Delete role"
                loading={remove.isPending}
                onConfirm={destroy}
            />
        </motion.div>
    );
}

export default function AdminRolesPage() {
    const { data, isLoading } = useRoles();
    const save = useSaveRole();
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [permissions, setPermissions] = React.useState<string[]>([]);

    const create = async () => {
        if (!/^[a-z0-9_-]{2,50}$/i.test(name)) {
            AppToast.warning("Use 2–50 letters, numbers, dashes or underscores.");
            return;
        }
        try {
            const response = await save.mutateAsync({ name, permissions });
            AppToast.success(response.message);
            setOpen(false);
            setName("");
            setPermissions([]);
        } catch (err) {
            AppToast.apiError(err, "Could not create role");
        }
    };

    return (
        <div className="space-y-5">
            <AppPageHeader
                icon={<ShieldCheck />}
                title="Roles & access"
                description="Control what each team member can see and do in the console."
                actions={
                    <AppButton leftIcon={<Plus />} onClick={() => setOpen(true)}>
                        New role
                    </AppButton>
                }
            />

            {isLoading ? (
                <div className="grid gap-4 xl:grid-cols-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-72 animate-pulse rounded-2xl bg-fg/5" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                    {data?.roles.map((role, index) => (
                        <RoleCard key={`${role.id}-${role.permissions.join()}`} role={role} permissions={data.permissions} index={index} />
                    ))}
                </div>
            )}

            <AppDialog
                open={open}
                onOpenChange={setOpen}
                size="lg"
                title="Create role"
                description="Custom roles get console access as soon as they hold at least one permission."
                footer={
                    <>
                        <AppButton tone="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </AppButton>
                        <AppButton onClick={create} loading={save.isPending}>
                            Create role
                        </AppButton>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-foreground/80">Role name</label>
                        <input value={name} onChange={(event) => setName(event.target.value.toLowerCase())} placeholder="e.g. cashier" className={inputClass} />
                    </div>
                    {data ? <PermissionGrid permissions={data.permissions} value={permissions} onChange={setPermissions} /> : null}
                </div>
            </AppDialog>
        </div>
    );
}

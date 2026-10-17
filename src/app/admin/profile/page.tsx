"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Activity, KeyRound, Save, ShieldCheck, UserRound } from "lucide-react";
import { AppBadge, AppButton, AppCard, AppTextField, AppToast } from "@/components/app";
import { useAuth } from "@/hooks/useAuth";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { formatDateTime, initials, timeAgo, titleCase } from "@/lib/format";
import { useMe, useUpdatePassword, useUpdateProfile } from "@/lib/ProfileAPI";
import { cn } from "@/lib/utils";

type Tab = "profile" | "security" | "access";

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
    { id: "profile", label: "Profile", icon: UserRound },
    { id: "security", label: "Security", icon: KeyRound },
    { id: "access", label: "Access & activity", icon: ShieldCheck },
];

const profileSchema = z.object({
    first_name: z.string().trim().max(100),
    last_name: z.string().trim().max(100),
    email: z.union([z.literal(""), z.email("Enter a valid email")]),
    phone: z.string().trim().max(20),
});

const passwordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required"),
        password: z.string().min(8, "Use at least 8 characters for staff accounts").max(100),
        password_confirmation: z.string(),
    })
    .refine((value) => value.password === value.password_confirmation, { path: ["password_confirmation"], message: "Passwords do not match" });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function AdminProfilePage() {
    const { user } = useAuth();
    const { data: me } = useMe();
    const { update } = useSession();
    const updateProfile = useUpdateProfile();
    const updatePassword = useUpdatePassword();
    const [tab, setTab] = React.useState<Tab>("profile");

    const profileForm = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { first_name: "", last_name: "", email: "", phone: "" } });
    const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { current_password: "", password: "", password_confirmation: "" } });

    React.useEffect(() => {
        if (me) profileForm.reset({ first_name: me.first_name ?? "", last_name: me.last_name ?? "", email: me.email ?? "", phone: me.phone ?? "" });
    }, [me, profileForm]);

    const saveProfile = profileForm.handleSubmit(async (values) => {
        try {
            const response = await updateProfile.mutateAsync({
                first_name: values.first_name || undefined,
                last_name: values.last_name || undefined,
                email: values.email || undefined,
                phone: values.phone || undefined,
            });
            await update({ user: { ...response.data } });
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => profileForm.setError(key as keyof ProfileValues, { message }));
            AppToast.error("Could not update profile", { description: apiError(err) });
        }
    });

    const savePassword = passwordForm.handleSubmit(async (values) => {
        try {
            const response = await updatePassword.mutateAsync(values);
            passwordForm.reset();
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => passwordForm.setError(key as keyof PasswordValues, { message }));
            AppToast.error("Could not update password", { description: apiError(err) });
        }
    });

    const name = me?.name || user?.name || "Admin";
    const permissions = me?.permissions ?? user?.permissions ?? [];

    return (
        <div className="space-y-5">
            <div className="border-gradient relative overflow-hidden rounded-3xl bg-linear-to-br from-plum-700/70 via-plum-850 to-plum-900 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                    <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-linear-to-br from-ember-500 to-gold-500 font-display text-xl font-extrabold text-white">{initials(name)}</span>
                    <div className="min-w-0">
                        <h1 className="truncate font-display text-2xl font-extrabold">{name}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <AppBadge size="sm" tone="ember">
                                {titleCase(me?.role ?? user?.role ?? "staff")}
                            </AppBadge>
                            <span className="text-xs text-muted-foreground">{me?.email ?? user?.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
                <div className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:self-start">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={cn(
                                "relative flex items-center gap-3 rounded-2xl border p-3 text-left text-sm font-semibold transition",
                                tab === item.id ? "border-gold-400/50 bg-gold-400/10 text-gold-200" : "border-border bg-fg/3 text-foreground/75 hover:border-fg/20"
                            )}
                        >
                            {tab === item.id ? <motion.span layoutId="profile-tab" className="bg-gold absolute top-3 bottom-3 left-0 w-1 rounded-full" /> : null}
                            <item.icon className="size-4 shrink-0" />
                            <span className="truncate">{item.label}</span>
                        </button>
                    ))}
                </div>

                <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {tab === "profile" ? (
                        <AppCard title="Personal details" description="Your name and contact details in the console." icon={<UserRound />}>
                            <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2" noValidate>
                                <AppTextField control={profileForm.control} name="first_name" label="First name" />
                                <AppTextField control={profileForm.control} name="last_name" label="Last name" />
                                <AppTextField control={profileForm.control} name="email" label="Email" type="email" />
                                <AppTextField control={profileForm.control} name="phone" label="Mobile" />
                                <div className="sm:col-span-2">
                                    <AppButton type="submit" leftIcon={<Save />} loading={profileForm.formState.isSubmitting}>
                                        Save profile
                                    </AppButton>
                                </div>
                            </form>
                        </AppCard>
                    ) : tab === "security" ? (
                        <AppCard title="Change password" description="Use a strong, unique password for your back-office account." icon={<KeyRound />}>
                            <form onSubmit={savePassword} className="grid max-w-lg gap-4" noValidate>
                                <AppTextField control={passwordForm.control} name="current_password" label="Current password" type="password" autoComplete="current-password" />
                                <AppTextField control={passwordForm.control} name="password" label="New password" type="password" autoComplete="new-password" />
                                <AppTextField control={passwordForm.control} name="password_confirmation" label="Confirm new password" type="password" autoComplete="new-password" />
                                <div>
                                    <AppButton type="submit" tone="ember" loading={passwordForm.formState.isSubmitting}>
                                        Update password
                                    </AppButton>
                                </div>
                            </form>
                        </AppCard>
                    ) : (
                        <div className="grid gap-5 xl:grid-cols-2">
                            <AppCard title="Permissions" description={`Granted through the ${titleCase(me?.role ?? user?.role ?? "staff")} role.`} icon={<ShieldCheck />}>
                                <div className="flex flex-wrap gap-1.5">
                                    {permissions.map((permission) => (
                                        <AppBadge key={permission} size="sm" tone="violet">
                                            {permission}
                                        </AppBadge>
                                    ))}
                                </div>
                            </AppCard>
                            <AppCard title="Activity" icon={<Activity />}>
                                <Row label="Last login" value={me?.last_login_at ? `${formatDateTime(me.last_login_at)} · ${timeAgo(me.last_login_at)}` : "—"} />
                                <Row label="Member since" value={me?.created_at ? formatDateTime(me.created_at) : "—"} />
                                <Row label="Account status" value={me?.is_active ? "Active" : "Suspended"} />
                            </AppCard>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-right font-semibold">{value}</span>
        </div>
    );
}

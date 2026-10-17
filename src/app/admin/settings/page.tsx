"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Copy, CreditCard, Gamepad2, Globe, Lock, Save, Server, Settings } from "lucide-react";
import { AppBadge, AppButton, AppCard, AppPageHeader, AppSwitchField, AppTextField, AppTextareaField, AppToast } from "@/components/app";
import { AdminField } from "@/components/admin/AdminFields";
import { useAdminSettings, useSaveSettings } from "@/lib/AdminAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import type { AppSettings, SystemInfo } from "@/types/Admin";

type Tab = "general" | "payments" | "games" | "security";

const tabs: Array<{ id: Tab; label: string; description: string; icon: React.ElementType }> = [
    { id: "general", label: "General", description: "Brand, support and notices", icon: Globe },
    { id: "payments", label: "Payments", description: "GCash, Maya and limits", icon: CreditCard },
    { id: "games", label: "Games", description: "Provider and lobby options", icon: Gamepad2 },
    { id: "security", label: "Security", description: "Sessions and system info", icon: Lock },
];

type FormValues = {
    general: AppSettings["general"];
    payments: Omit<AppSettings["payments"], "min_deposit" | "max_deposit" | "min_withdraw" | "max_withdraw"> & { min_deposit: string; max_deposit: string; min_withdraw: string; max_withdraw: string };
    games: Omit<AppSettings["games"], "hot_badge_limit"> & { hot_badge_limit: string };
};

const toForm = (settings: AppSettings): FormValues => ({
    general: settings.general,
    payments: {
        ...settings.payments,
        min_deposit: String(settings.payments.min_deposit),
        max_deposit: String(settings.payments.max_deposit),
        min_withdraw: String(settings.payments.min_withdraw),
        max_withdraw: String(settings.payments.max_withdraw),
    },
    games: { ...settings.games, hot_badge_limit: String(settings.games.hot_badge_limit) },
});

export default function AdminSettingsPage() {
    const { data, isLoading } = useAdminSettings();
    const save = useSaveSettings();
    const [tab, setTab] = React.useState<Tab>("general");
    const form = useForm<FormValues>();

    React.useEffect(() => {
        if (data) form.reset(toForm(data.settings));
    }, [data, form]);

    const submit = form.handleSubmit(async (values) => {
        const payload =
            tab === "general"
                ? { general: values.general }
                : tab === "payments"
                  ? {
                        payments: {
                            ...values.payments,
                            min_deposit: Number(values.payments.min_deposit),
                            max_deposit: Number(values.payments.max_deposit),
                            min_withdraw: Number(values.payments.min_withdraw),
                            max_withdraw: Number(values.payments.max_withdraw),
                        },
                    }
                  : { games: { ...values.games, hot_badge_limit: Number(values.games.hot_badge_limit) } };

        try {
            const response = await save.mutateAsync(payload);
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => form.setError(key as never, { message }));
            AppToast.error("Could not save settings", { description: apiError(err) });
        }
    });

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<Settings />} title="Settings" description="Configure the platform. Changes apply immediately for every player." />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1 lg:self-start">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={cn(
                                "relative flex items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition",
                                tab === item.id ? "border-gold-400/50 bg-gold-400/10" : "border-border bg-fg/3 hover:border-fg/20"
                            )}
                        >
                            {tab === item.id ? <motion.span layoutId="settings-tab" className="bg-gold absolute top-3 bottom-3 left-0 w-1 rounded-full" /> : null}
                            <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tab === item.id ? "bg-gold text-[#2a1600]" : "bg-fg/6 text-gold-300")}>
                                <item.icon className="size-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-bold">{item.label}</span>
                                <span className="hidden truncate text-xs text-muted-foreground sm:block">{item.description}</span>
                            </span>
                        </button>
                    ))}
                </div>

                {isLoading || !data ? (
                    <div className="h-96 animate-pulse rounded-2xl bg-fg/5" />
                ) : (
                    <motion.form key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="space-y-5" noValidate>
                        {tab === "general" ? <GeneralTab form={form} /> : tab === "payments" ? <PaymentsTab form={form} /> : tab === "games" ? <GamesTab form={form} system={data.system} /> : <SecurityTab system={data.system} />}

                        {tab !== "security" ? (
                            <div className="flex justify-end">
                                <AppButton type="submit" leftIcon={<Save />} loading={save.isPending}>
                                    Save {tabs.find((item) => item.id === tab)?.label.toLowerCase()} settings
                                </AppButton>
                            </div>
                        ) : null}
                    </motion.form>
                )}
            </div>
        </div>
    );
}

type TabProps = { form: ReturnType<typeof useForm<FormValues>> };

function GeneralTab({ form }: TabProps) {
    return (
        <>
            <AppCard title="Brand" description="Shown across the site and in emails." icon={<Globe />}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <AppTextField control={form.control} name="general.site_name" label="Site name" />
                    <AppTextField control={form.control} name="general.tagline" label="Tagline" />
                </div>
            </AppCard>
            <AppCard title="Support" description="How players reach your team.">
                <div className="grid gap-4 sm:grid-cols-2">
                    <AppTextField control={form.control} name="general.support_email" label="Support email" type="email" />
                    <AppTextField control={form.control} name="general.support_phone" label="Support phone" />
                </div>
            </AppCard>
            <AppCard title="Notices">
                <div className="space-y-4">
                    <AppTextareaField control={form.control} name="general.announcement" label="Site-wide announcement" rows={2} placeholder="Shown at the top of every page" />
                    <AppSwitchField control={form.control} name="general.maintenance_mode" label="Maintenance mode" hint="Show a maintenance notice to players" />
                </div>
            </AppCard>
        </>
    );
}

function PaymentsTab({ form }: TabProps) {
    return (
        <>
            {(["gcash", "maya"] as const).map((method) => (
                <AppCard
                    key={method}
                    title={method === "gcash" ? "GCash" : "Maya"}
                    description="Players send deposits to this account."
                    icon={<img src={method === "gcash" ? "/gcash.png" : "/maya.png"} alt="" className="size-6 rounded-md bg-white object-contain p-0.5" />}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <AppSwitchField control={form.control} name={`payments.${method}_enabled`} label="Enabled" hint="Show this channel in the wallet" className="sm:col-span-2" />
                        <AppTextField control={form.control} name={`payments.${method}_account_name`} label="Account name" />
                        <AppTextField control={form.control} name={`payments.${method}_account_number`} label="Account number" />
                        <div className="sm:col-span-2">
                            <AdminField control={form.control} field={{ name: `payments.${method}_qr`, label: "Payment QR code", type: "image", folder: "payments", hint: "Upload the QR from your GCash / Maya app. Players scan it on the deposit page." }} />
                        </div>
                    </div>
                </AppCard>
            ))}
            <AppCard title="Limits & compliance" icon={<CreditCard />}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <AppTextField control={form.control} name="payments.min_deposit" label="Minimum deposit" prefix="₱" inputMode="numeric" />
                    <AppTextField control={form.control} name="payments.max_deposit" label="Maximum deposit" prefix="₱" inputMode="numeric" />
                    <AppTextField control={form.control} name="payments.min_withdraw" label="Minimum withdrawal" prefix="₱" inputMode="numeric" />
                    <AppTextField control={form.control} name="payments.max_withdraw" label="Maximum withdrawal" prefix="₱" inputMode="numeric" />
                    <AppSwitchField control={form.control} name="payments.require_kyc_for_withdraw" label="Require KYC for withdrawals" hint="Players must be verified before cashing out" className="sm:col-span-2" />
                </div>
            </AppCard>
        </>
    );
}

function GamesTab({ form, system }: TabProps & { system: SystemInfo }) {
    const provider = system.game_provider;

    return (
        <>
            <AppCard
                title="Game provider"
                description="Configured on the server through environment variables."
                icon={<Server />}
                actions={
                    <AppBadge tone={provider.connected ? "success" : "warning"} dot>
                        {provider.connected ? "Connected" : "Not connected"}
                    </AppBadge>
                }
            >
                <div className="grid gap-2 sm:grid-cols-2">
                    <Info label="Driver" value={provider.driver} />
                    <Info label="Name" value={provider.name} />
                    <Info label="Currency" value={provider.currency} />
                    <Info label="Session lifetime" value={`${provider.session_ttl_minutes} minutes`} />
                </div>
                <div className="mt-3 rounded-xl border border-border bg-fg/5 p-3">
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Wallet callback URL</div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                        <code className="truncate text-xs text-gold-200">{provider.callback_url}</code>
                        <AppButton
                            type="button"
                            tone="ghost"
                            size="icon-sm"
                            onClick={() => {
                                void navigator.clipboard?.writeText(provider.callback_url);
                                AppToast.success("Callback URL copied");
                            }}
                            aria-label="Copy callback URL"
                        >
                            <Copy />
                        </AppButton>
                    </div>
                </div>
            </AppCard>
            <AppCard title="Lobby" icon={<Gamepad2 />}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <AppSwitchField control={form.control} name="games.demo_enabled" label="Demo play" hint="Allow free demo sessions" className="sm:col-span-2" />
                    <AppTextField control={form.control} name="games.hot_badge_limit" label="Hot games shown" inputMode="numeric" hint="How many hot games the spotlight lists" />
                </div>
            </AppCard>
        </>
    );
}

function SecurityTab({ system }: { system: SystemInfo }) {
    return (
        <>
            <AppCard title="Sessions" icon={<Lock />}>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Info label="Login token lifetime" value={system.security.token_expiration_minutes ? `${Math.round(system.security.token_expiration_minutes / 60)} hours` : "Never expires"} />
                    <Info label="OTP development mode" value={system.security.otp_dev_mode ? "On — codes shown on screen" : "Off"} warn={system.security.otp_dev_mode} />
                </div>
            </AppCard>
            <AppCard title="System" icon={<Server />}>
                <div className="grid gap-2 sm:grid-cols-2">
                    <Info label="Environment" value={system.app.environment} warn={system.app.environment !== "production"} />
                    <Info label="Debug mode" value={system.app.debug ? "On" : "Off"} warn={system.app.debug} />
                    <Info label="Laravel" value={system.app.laravel} />
                    <Info label="PHP" value={system.app.php} />
                </div>
            </AppCard>
        </>
    );
}

function Info({ label, value, warn }: { label: string; value: React.ReactNode; warn?: boolean }) {
    return (
        <div className={cn("rounded-xl border p-3", warn ? "border-warning/40 bg-warning/8" : "border-border bg-fg/3")}>
            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{label}</div>
            <div className={cn("mt-0.5 truncate text-sm font-bold", warn && "text-amber-300")}>{value}</div>
        </div>
    );
}

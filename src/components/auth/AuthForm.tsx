"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Lock, Mail, Smartphone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { AppButton, AppTextField, AppToast } from "@/components/app";
import { useRegister, useRequestOtp } from "@/lib/AuthenticationAPI";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { cn } from "@/lib/utils";
import type { AuthMode } from "@/stores/useUiStore";

const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

const otpSchema = z.object({
    phone: z.string().regex(/^(\+?63|0)?9\d{9}$/, "Enter a valid PH mobile number"),
    code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

const registerSchema = z
    .object({
        first_name: z.string().trim().min(1, "First name is required").max(100),
        last_name: z.string().trim().min(1, "Last name is required").max(100),
        email: z.email("Enter a valid email"),
        phone: z.union([z.literal(""), z.string().regex(/^(\+?63|0)?9\d{9}$/, "Enter a valid PH mobile number")]),
        password: z.string().min(6, "At least 6 characters").max(100),
        password_confirmation: z.string(),
    })
    .refine((value) => value.password === value.password_confirmation, { path: ["password_confirmation"], message: "Passwords do not match" });

type LoginValues = z.infer<typeof loginSchema>;
type OtpValues = z.infer<typeof otpSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

type AuthFormProps = {
    mode: AuthMode;
    onModeChange: (mode: AuthMode) => void;
    onSuccess?: () => void;
    redirectAfter?: boolean;
};

export default function AuthForm({ mode, onModeChange, onSuccess, redirectAfter = false }: AuthFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [method, setMethod] = React.useState<"password" | "otp">("password");
    const [agree, setAgree] = React.useState(false);
    const [agreeError, setAgreeError] = React.useState(false);

    const finish = async (message: string) => {
        AppToast.success(message);
        const session = await getSession();
        onSuccess?.();
        router.refresh();

        if (!redirectAfter) return;

        const callbackUrl = searchParams.get("callbackUrl");
        const backoffice = session?.user && (session.user.role === "admin" || session.user.role === "staff" || session.user.permissions.length > 0);
        router.replace(callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : backoffice ? "/admin" : "/account");
    };

    const ensureAgreed = () => {
        if (agree) return true;
        setAgreeError(true);
        AppToast.warning("Please confirm you are 21+ and accept the terms.");
        return false;
    };

    return (
        <div className="w-full">
            <div className="relative grid grid-cols-2 rounded-2xl border border-border bg-black/30 p-1">
                {(["login", "register"] as const).map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onModeChange(item)}
                        className={cn("relative h-10 rounded-xl text-sm font-bold transition", mode === item ? "text-[#2a1600]" : "text-foreground/65 hover:text-foreground")}
                    >
                        {mode === item ? <motion.span layoutId="auth-mode" className="bg-gold absolute inset-0 rounded-xl" transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                        <span className="relative">{item === "login" ? "Log in" : "Create account"}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div key={`${mode}-${method}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mt-5">
                    {mode === "login" ? (
                        <>
                            <div className="mb-4 flex gap-2">
                                <MethodPill active={method === "password"} onClick={() => setMethod("password")} icon={<Mail />} label="Email" />
                                <MethodPill active={method === "otp"} onClick={() => setMethod("otp")} icon={<Smartphone />} label="Mobile OTP" />
                            </div>
                            {method === "password" ? (
                                <PasswordLogin ensureAgreed={ensureAgreed} onDone={() => finish("Welcome back!")} />
                            ) : (
                                <OtpLogin ensureAgreed={ensureAgreed} onDone={() => finish("You're signed in!")} />
                            )}
                        </>
                    ) : (
                        <RegisterForm ensureAgreed={ensureAgreed} onDone={() => finish("Account created — welcome to ManpakBet!")} />
                    )}
                </motion.div>
            </AnimatePresence>

            <label className={cn("mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border bg-white/2.5 p-3 transition", agreeError && !agree ? "border-destructive/60" : "border-border")}>
                <Checkbox
                    checked={agree}
                    onCheckedChange={(value) => {
                        setAgree(Boolean(value));
                        setAgreeError(false);
                    }}
                    className="mt-0.5 border-white/30 data-[state=checked]:border-gold-400 data-[state=checked]:bg-gold-400 data-[state=checked]:text-[#2a1600]"
                />
                <span className="text-xs leading-relaxed text-muted-foreground">
                    I confirm I am at least 21 years old, not a restricted person, and I agree to the{" "}
                    <Link href="/terms" className="font-semibold text-gold-300 hover:underline">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-semibold text-gold-300 hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </span>
            </label>
        </div>
    );
}

function MethodPill({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition [&_svg]:size-3.5",
                active ? "border-gold-400/50 bg-gold-400/12 text-gold-200" : "border-border text-foreground/65 hover:text-foreground"
            )}
        >
            {icon}
            {label}
        </button>
    );
}

function PasswordLogin({ ensureAgreed, onDone }: { ensureAgreed: () => boolean; onDone: () => Promise<void> }) {
    const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

    const submit = form.handleSubmit(async (values) => {
        if (!ensureAgreed()) return;
        const result = await signIn("credentials", { ...values, redirect: false });
        if (result?.error) {
            AppToast.error("Login failed", { description: result.error === "CredentialsSignin" ? "Invalid email or password" : result.error });
            return;
        }
        await onDone();
    });

    return (
        <form onSubmit={submit} className="space-y-3.5" noValidate>
            <AppTextField control={form.control} name="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
            <AppTextField control={form.control} name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
            <AppButton type="submit" size="lg" block shine loading={form.formState.isSubmitting} leftIcon={<Lock />}>
                Log in securely
            </AppButton>
        </form>
    );
}

function OtpLogin({ ensureAgreed, onDone }: { ensureAgreed: () => boolean; onDone: () => Promise<void> }) {
    const form = useForm<OtpValues>({ resolver: zodResolver(otpSchema), defaultValues: { phone: "", code: "" } });
    const requestOtp = useRequestOtp();
    const [cooldown, setCooldown] = React.useState(0);

    React.useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const sendCode = async () => {
        const valid = await form.trigger("phone");
        if (!valid) return;
        try {
            const response = await requestOtp.mutateAsync(form.getValues("phone"));
            setCooldown(60);
            const devCode = response.data?.dev_code;
            AppToast.success(response.message || "Verification code sent", { description: devCode ? `Development code: ${devCode}` : "Check your SMS inbox." });
            if (devCode) form.setValue("code", devCode);
        } catch (err) {
            AppToast.apiError(err, "Could not send code");
        }
    };

    const submit = form.handleSubmit(async (values) => {
        if (!ensureAgreed()) return;
        const result = await signIn("otp", { ...values, redirect: false });
        if (result?.error) {
            AppToast.error("Verification failed", { description: result.error === "CredentialsSignin" ? "Invalid code" : result.error });
            return;
        }
        await onDone();
    });

    return (
        <form onSubmit={submit} className="space-y-3.5" noValidate>
            <AppTextField control={form.control} name="phone" label="Mobile number" type="tel" inputMode="tel" placeholder="0917 123 4567" prefix="🇵🇭" autoComplete="tel" />
            <div className="grid grid-cols-[1fr_auto] items-end gap-2">
                <AppTextField control={form.control} name="code" label="Verification code" inputMode="numeric" placeholder="6-digit code" autoComplete="one-time-code" />
                <AppButton type="button" tone="surface" className="h-11" onClick={sendCode} loading={requestOtp.isPending} disabled={cooldown > 0}>
                    {cooldown > 0 ? `Resend ${cooldown}s` : "Get code"}
                </AppButton>
            </div>
            <AppButton type="submit" size="lg" block shine loading={form.formState.isSubmitting} leftIcon={<KeyRound />}>
                Verify & continue
            </AppButton>
            <p className="text-center text-xs text-muted-foreground">New numbers are registered automatically after verification.</p>
        </form>
    );
}

function RegisterForm({ ensureAgreed, onDone }: { ensureAgreed: () => boolean; onDone: () => Promise<void> }) {
    const form = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { first_name: "", last_name: "", email: "", phone: "", password: "", password_confirmation: "" },
    });
    const register = useRegister();

    const submit = form.handleSubmit(async (values) => {
        if (!ensureAgreed()) return;
        try {
            await register.mutateAsync({
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                password: values.password,
                phone: values.phone || undefined,
            });
        } catch (err) {
            const fields = apiFieldErrors(err);
            Object.entries(fields).forEach(([key, message]) => form.setError(key as keyof RegisterValues, { message }));
            AppToast.error("Registration failed", { description: apiError(err) });
            return;
        }

        const result = await signIn("credentials", { email: values.email, password: values.password, redirect: false });
        if (result?.error) {
            AppToast.error("Account created, but sign-in failed", { description: "Please log in manually." });
            return;
        }
        await onDone();
    });

    return (
        <form onSubmit={submit} className="space-y-3.5" noValidate>
            <div className="grid grid-cols-2 gap-3">
                <AppTextField control={form.control} name="first_name" label="First name" placeholder="Juan" autoComplete="given-name" />
                <AppTextField control={form.control} name="last_name" label="Last name" placeholder="Dela Cruz" autoComplete="family-name" />
            </div>
            <AppTextField control={form.control} name="email" label="Email address" type="email" placeholder="you@example.com" autoComplete="email" />
            <AppTextField control={form.control} name="phone" label="Mobile number (optional)" type="tel" inputMode="tel" placeholder="0917 123 4567" prefix="🇵🇭" autoComplete="tel" />
            <div className="grid gap-3 sm:grid-cols-2">
                <AppTextField control={form.control} name="password" label="Password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" />
                <AppTextField control={form.control} name="password_confirmation" label="Confirm password" type="password" placeholder="Repeat password" autoComplete="new-password" />
            </div>
            <AppButton type="submit" size="lg" block shine loading={form.formState.isSubmitting}>
                Create my account
            </AppButton>
        </form>
    );
}

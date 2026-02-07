"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import AppButton from "@/components/AppButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRegister } from "@/lib/AuthenticationAPI";

type Mode = "login" | "register";
type LoginType = "otp" | "password";

export default function AuthForm({
    initialMode,
    onDone,
}: {
    initialMode: Mode;
    onDone?: () => void;
}) {
    const [mode, setMode] = useState<Mode>(initialMode);
    const [loginType, setLoginType] = useState<LoginType>("otp");

    const title = useMemo(
        () => (mode === "register" ? "Create your account" : "Welcome back"),
        [mode]
    );

    const router = useRouter();
    const { mutateAsync: registerMutate, isPending: registerLoading } = useRegister();

    const [agree, setAgree] = useState(false);

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const requireAgree = true;

    const actionLabel =
        loginType === "otp" ? "Login/Register" : mode === "register" ? "Create account" : "Login";

    const submitPassword = async () => {
        if (requireAgree && !agree) {
            toast({
                title: "Confirm required",
                description: "Please confirm 21+ and accept Terms/Privacy.",
                variant: "destructive",
            });
            return;
        }

        if (!email) {
            toast({ title: "Missing email", description: "Email is required.", variant: "destructive" });
            return;
        }
        if (!password) {
            toast({
                title: "Missing password",
                description: "Password is required.",
                variant: "destructive",
            });
            return;
        }

        if (mode === "login") {
            const res = await signIn("credentials", { email, password, redirect: false });
            if (res?.error) {
                toast({ title: "Login failed", description: res.error, variant: "destructive" });
                return;
            }
            router.refresh();
            router.push("/user/dashboard");
            onDone?.();
            return;
        }

        await registerMutate({ inputs: { email, password } });
    };

    const getOtp = async () => {
        toast({ title: "Not ready", description: "Get Code needs backend endpoint.", variant: "destructive" });
    };

    const submitOtp = async () => {
        toast({
            title: "Not ready",
            description: "OTP login needs backend endpoint. UI ready.",
            variant: "destructive",
        });
    };

    const fieldWrap =
        "rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3";
    const fieldLabel = "text-[11px] text-white/55";
    const fieldInput =
        "h-10 sm:h-11 border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 text-sm";

    return (
        <div className="w-full">
            <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] sm:grid-cols-[0.95fr_1.05fr]">
                <div className="relative hidden sm:block min-h-[640px]">
                    <Image
                        src="/casino-promotional-banner.png"
                        alt="Casino Promotional Banner"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                        <div className="text-3xl font-extrabold tracking-wide">BIGGEST</div>
                        <div className="mt-1 text-lg font-semibold">CASINO PLATFORM</div>
                        <div className="mt-1 text-xs text-white/70">IN THE PHILIPPINES</div>
                    </div>
                </div>

                <div className="relative flex w-full flex-col bg-[radial-gradient(900px_circle_at_30%_0%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(900px_circle_at_90%_40%,rgba(59,130,246,0.12),transparent_55%),linear-gradient(to_bottom,rgba(10,30,40,0.96),rgba(7,18,28,0.96))]">
                    <div className="flex items-center justify-center px-5 pt-5 sm:px-6 sm:pt-6">
                        <div className="relative h-9 w-[190px] sm:h-10 sm:w-[210px]">
                            <Image src="/logo.png" alt="ManpakBet" fill priority className="object-contain" />
                        </div>
                    </div>

                    <div className="px-5 pt-3 sm:px-6 sm:pt-4">
                        <div className="text-center text-sm font-semibold">{title}</div>
                    </div>

                    <div className="px-4 pt-4 sm:px-6 sm:pt-5">
                        <Tabs value={loginType} onValueChange={(v) => setLoginType(v as LoginType)}>
                            <TabsList className="grid w-full grid-cols-2 bg-white/[0.06] p-1 rounded-2xl">
                                <TabsTrigger
                                    value="otp"
                                    className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-200"
                                >
                                    Verification Code
                                </TabsTrigger>
                                <TabsTrigger
                                    value="password"
                                    className="rounded-xl text-xs sm:text-sm data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-200"
                                >
                                    Password
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="otp" className="mt-4 space-y-3">
                                <div className={fieldWrap}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-9 items-center gap-2 rounded-xl bg-white/[0.05] px-2 text-sm text-white/80">
                                            <span className="text-xs">🇵🇭</span>
                                            <span className="text-xs text-white/70">+63</span>
                                        </div>
                                        <Input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Enter Phone Number"
                                            inputMode="tel"
                                            className={fieldInput}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_160px]">
                                    <div className={fieldWrap}>
                                        <Input
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Verification Code"
                                            className={fieldInput}
                                            disabled
                                        />
                                    </div>

                                    <AppButton
                                        tone="primary"
                                        className="h-11 sm:h-[52px] w-full rounded-2xl"
                                        onClick={getOtp}
                                    >
                                        Get Code
                                    </AppButton>
                                </div>

                                <AppButton tone="primary" className="h-11 sm:h-12 w-full rounded-2xl" onClick={submitOtp}>
                                    {actionLabel}
                                </AppButton>

                                <button className="w-full text-center text-xs text-emerald-200/80 hover:text-emerald-200">
                                    Didn&apos;t receive code?
                                </button>
                            </TabsContent>

                            <TabsContent value="password" className="mt-4 space-y-3">
                                <div className={fieldWrap}>
                                    <div className={fieldLabel}>Email</div>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@email.com"
                                        inputMode="email"
                                        className={fieldInput}
                                    />
                                </div>

                                <div className={fieldWrap}>
                                    <div className={fieldLabel}>Password</div>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className={fieldInput}
                                    />
                                </div>

                                <AppButton
                                    tone="primary"
                                    className="h-11 sm:h-12 w-full rounded-2xl"
                                    onClick={submitPassword}
                                    disabled={registerLoading}
                                >
                                    {actionLabel}
                                </AppButton>

                                {mode === "login" ? (
                                    <button className="w-full text-center text-xs text-emerald-200/80 hover:text-emerald-200">
                                        Forgot password?
                                    </button>
                                ) : null}
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="px-4 pt-4 sm:px-6">
                        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} />
                            <div className="text-xs leading-relaxed text-white/70">
                                I confirm that I am 21 years old and I agree to the{" "}
                                <Link href="/terms" className="text-emerald-200 underline underline-offset-4">
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-emerald-200 underline underline-offset-4">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 text-center text-[11px] text-white/55">
                            Prohibition to play in open and public places.
                        </div>
                    </div>

                    <div className="mt-4 px-4 pb-5 sm:mt-auto sm:px-6 sm:pt-4">
                        <div className="flex items-center justify-center">
                            <Image src="/pagcor-logo.svg" alt="PAGCOR" width={170} height={40} className="opacity-95" />
                        </div>

                        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-full bg-[linear-gradient(90deg,#ff4d6d,#ffb703,#8ac926,#00c2ff,#7c3aed)]" />
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                className={[
                                    "rounded-2xl px-4 py-2 text-xs transition",
                                    mode === "register"
                                        ? "bg-white/12 text-white"
                                        : "bg-white/[0.04] text-white/70 hover:bg-white/10",
                                ].join(" ")}
                                onClick={() => setMode("register")}
                            >
                                Register
                            </button>
                            <button
                                className={[
                                    "rounded-2xl px-4 py-2 text-xs transition",
                                    mode === "login"
                                        ? "bg-white/12 text-white"
                                        : "bg-white/[0.04] text-white/70 hover:bg-white/10",
                                ].join(" ")}
                                onClick={() => setMode("login")}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, ArrowRight, ShieldCheck, Sparkles, Lock, BadgeCheck } from "lucide-react";
import { AppButton } from "@/components/app-button";

export function AuthDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
}) {
    const [mode, setMode] = useState<"register" | "login">("register");
    const title = useMemo(() => (mode === "register" ? "Create your account" : "Welcome back"), [mode]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-[24px] border-white/10 bg-[linear-gradient(to_bottom,rgba(13,35,50,0.96),rgba(9,22,34,0.96))] p-4 text-white shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-[980px] sm:p-6">
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center gap-2 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <div className="relative h-12 w-[180px] sm:h-14 sm:w-[220px]">
                                <Image src="/logo.png" alt="ManpakBet" fill priority className="object-contain object-center" />
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="text-base font-semibold sm:text-lg">{title}</div>
                                <div className="mt-0.5 text-xs text-white/60">Secure sign-in with OTP or email.</div>
                            </div>
                        </div>

                        <div className="mt-3 flex w-full justify-center gap-2 sm:mt-0 sm:w-auto">
                            <AppButton tone="surface" className={mode === "register" ? "bg-white/15" : ""} onClick={() => setMode("register")}>
                                Register
                            </AppButton>
                            <AppButton tone="surface" className={mode === "login" ? "bg-white/15" : ""} onClick={() => setMode("login")}>
                                Login
                            </AppButton>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:gap-6">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white/70">
                            <ShieldCheck className="h-4 w-4 text-emerald-300" />
                            Secure Access
                            <span className="ml-auto inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-white/70">
                                <Lock className="h-3 w-3" />
                                Protected
                            </span>
                        </div>

                        <Tabs defaultValue="phone" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2 bg-white/[0.06] p-1">
                                <TabsTrigger value="phone" className="rounded-xl data-[state=active]:bg-white/15">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Phone OTP
                                </TabsTrigger>
                                <TabsTrigger value="email" className="rounded-xl data-[state=active]:bg-white/15">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="phone" className="mt-4 space-y-4">
                                <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/70">
                                    <Sparkles className="mt-0.5 h-4 w-4 text-cyan-300" />
                                    <div>
                                        <div className="font-medium text-white/85">One-tap OTP</div>
                                        <div className="mt-0.5 text-xs text-white/60">Use phone OTP for {mode}. No password required.</div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Phone number</div>
                                    <div className="flex gap-2">
                                        <div className="w-20 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/80">+63</div>
                                        <Input className="h-11 rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/45 focus-visible:ring-white/20" placeholder="9XXXXXXXXX" />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">OTP</div>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <Input className="h-11 rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/45 focus-visible:ring-white/20" placeholder="Enter code" />
                                        <AppButton tone="surface" className="h-11 w-full sm:w-auto">
                                            Get Code
                                        </AppButton>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                                    <Checkbox id="agree" />
                                    <label htmlFor="agree" className="text-xs text-white/70">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-white underline underline-offset-4">
                                            Terms
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="text-white underline underline-offset-4">
                                            Privacy Policy
                                        </Link>
                                        .
                                    </label>
                                </div>

                                <AppButton className="h-11 w-full">
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </AppButton>

                                <div className="flex items-center gap-3">
                                    <Separator className="flex-1 bg-white/10" />
                                    <div className="text-xs text-white/60">or continue with</div>
                                    <Separator className="flex-1 bg-white/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <AppButton tone="surface" className="h-11">
                                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                                            <Image src="/google.png" alt="Google" width={18} height={18} />
                                        </span>
                                        Google
                                    </AppButton>
                                    <AppButton tone="surface" className="h-11">
                                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                                            <Image src="/facebook.png" alt="Facebook" width={18} height={18} />
                                        </span>
                                        Facebook
                                    </AppButton>
                                </div>
                            </TabsContent>

                            <TabsContent value="email" className="mt-4 space-y-4">
                                <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/70">
                                    <BadgeCheck className="mt-0.5 h-4 w-4 text-emerald-300" />
                                    <div>
                                        <div className="font-medium text-white/85">Email + password</div>
                                        <div className="mt-0.5 text-xs text-white/60">Use email + password for {mode}.</div>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Email</div>
                                    <Input className="h-11 rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/45 focus-visible:ring-white/20" placeholder="you@email.com" />
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Password</div>
                                    <Input type="password" className="h-11 rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/45 focus-visible:ring-white/20" placeholder="••••••••" />
                                </div>

                                <AppButton className="h-11 w-full">
                                    {mode === "register" ? "Create account" : "Login"} <ArrowRight className="ml-2 h-4 w-4" />
                                </AppButton>

                                <div className="flex items-center gap-3">
                                    <Separator className="flex-1 bg-white/10" />
                                    <div className="text-xs text-white/60">or continue with</div>
                                    <Separator className="flex-1 bg-white/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <AppButton tone="surface" className="h-11">
                                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                                            <Image src="/google.png" alt="Google" width={18} height={18} />
                                        </span>
                                        Google
                                    </AppButton>
                                    <AppButton tone="surface" className="h-11">
                                        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center">
                                            <Image src="/facebook.png" alt="Facebook" width={18} height={18} />
                                        </span>
                                        Facebook
                                    </AppButton>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="hidden md:block">
                        <div className="relative h-full min-h-[520px] overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.03]">
                            <Image src="/auth-hero.svg" alt="Auth illustration" fill className="object-cover" priority />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

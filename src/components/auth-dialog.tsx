"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";

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
            <DialogContent className="rounded-[28px] border-white/10 bg-[linear-gradient(to_bottom,rgba(13,35,50,0.95),rgba(9,22,34,0.95))] text-white backdrop-blur-xl sm:max-w-[920px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-4 text-white">
                        <div className="relative h-12 w-[180px]">
                            <Image src="/logo.png" alt="ManpakBet" fill className="object-contain object-left" priority />
                        </div>
                        <span className="text-lg font-semibold">{title}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-white/70">Secure Access</div>
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    className={mode === "register" ? "bg-white/15 text-white" : "bg-white/[0.06] text-white/80"}
                                    onClick={() => setMode("register")}
                                >
                                    Register
                                </Button>
                                <Button
                                    variant="secondary"
                                    className={mode === "login" ? "bg-white/15 text-white" : "bg-white/[0.06] text-white/80"}
                                    onClick={() => setMode("login")}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>

                        <Tabs defaultValue="phone" className="mt-4">
                            <TabsList className="grid w-full grid-cols-2 bg-white/[0.06]">
                                <TabsTrigger value="phone" className="data-[state=active]:bg-white/15">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Phone OTP
                                </TabsTrigger>
                                <TabsTrigger value="email" className="data-[state=active]:bg-white/15">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="phone" className="mt-4 space-y-4">
                                <div className="text-sm text-white/70">Use phone OTP for {mode}. No password required.</div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Phone number</div>
                                    <div className="flex gap-2">
                                        <div className="w-20 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/80">
                                            +63
                                        </div>
                                        <Input
                                            className="rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/50"
                                            placeholder="9XXXXXXXXX"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">OTP</div>
                                    <div className="flex gap-2">
                                        <Input
                                            className="rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/50"
                                            placeholder="Enter code"
                                        />
                                        <Button
                                            variant="secondary"
                                            className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                        >
                                            Get Code
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3">
                                    <Checkbox id="agree" />
                                    <label htmlFor="agree" className="text-xs text-white/70">
                                        I agree to the Terms and Privacy Policy.
                                    </label>
                                </div>

                                <AppButton className="w-full">
                                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                                </AppButton>

                                <div className="flex items-center gap-3">
                                    <Separator className="flex-1 bg-white/10" />
                                    <div className="text-xs text-white/60">or continue with</div>
                                    <Separator className="flex-1 bg-white/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                    >
                                        Google
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                    >
                                        Facebook
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="email" className="mt-4 space-y-4">
                                <div className="text-sm text-white/70">Use email + password for {mode} (UI only for now).</div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Email</div>
                                    <Input
                                        className="rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/50"
                                        placeholder="you@email.com"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <div className="text-xs text-white/70">Password</div>
                                    <Input
                                        type="password"
                                        className="rounded-2xl border-white/10 bg-white/[0.06] text-white placeholder:text-white/50"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <AppButton className="w-full">
                                    {mode === "register" ? "Create account" : "Login"} <ArrowRight className="ml-2 h-4 w-4" />
                                </AppButton>

                                <div className="flex items-center gap-3">
                                    <Separator className="flex-1 bg-white/10" />
                                    <div className="text-xs text-white/60">or continue with</div>
                                    <Separator className="flex-1 bg-white/10" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                    >
                                        Google
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="rounded-2xl border border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                                    >
                                        Facebook
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
                        <div className="text-sm font-semibold text-white">What you get</div>
                        <div className="mt-3 space-y-3">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                                    One-tap flow
                                </div>
                                <div className="mt-1 text-xs text-white/70">Phone OTP for register or login.</div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <ShieldCheck className="h-4 w-4 text-cyan-300" />
                                    Social login
                                </div>
                                <div className="mt-1 text-xs text-white/70">Google / Facebook redirect UI.</div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                                    <ShieldCheck className="h-4 w-4 text-amber-300" />
                                    Secure session
                                </div>
                                <div className="mt-1 text-xs text-white/70">Sanctum cookies + CSRF protection.</div>
                            </div>

                            <div className="mt-2 text-xs text-white/60">
                                By continuing, you agree to our{" "}
                                <a className="text-white underline" href="/terms">
                                    Terms & Conditions
                                </a>
                                .
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

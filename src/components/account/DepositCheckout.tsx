"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, Copy, Download, Loader2, Lock, QrCode, ScanLine, ShieldCheck, Smartphone, XCircle } from "lucide-react";
import { AppLogo, AppToast } from "@/components/app";
import { paymentMethods } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { toAssetUrl } from "@/lib/assets";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTransaction } from "@/lib/WalletAPI";

const SESSION_MINUTES = 15;

const themes = {
    gcash: { label: "GCash", brand: "#0a5bd8", deep: "#0646ad", soft: "#eaf1fd", deepLink: "gcash://", fallbackQr: "/gcash-qr.png" },
    maya: { label: "Maya", brand: "#00a85a", deep: "#007d43", soft: "#e6f7ee", deepLink: "paymaya://", fallbackQr: null },
} as const;

const subscribeClock = (onChange: () => void) => {
    const timer = window.setInterval(onChange, 1000);
    return () => window.clearInterval(timer);
};

const useNowSeconds = () =>
    React.useSyncExternalStore(
        subscribeClock,
        () => Math.floor(Date.now() / 1000),
        () => 0
    );

const copy = (value: string, label: string) => {
    void navigator.clipboard?.writeText(value);
    AppToast.success(`${label} copied`);
};

function CopyField({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: string }) {
    return (
        <button
            type="button"
            onClick={() => copy(value, label)}
            className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-slate-300 hover:shadow-sm"
        >
            <span className="min-w-0">
                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">{label}</span>
                <span className={cn("block truncate text-[15px] font-bold", mono && "font-mono tracking-wide")} style={accent ? { color: accent } : undefined}>
                    {value}
                </span>
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 transition group-hover:bg-slate-200">
                <Copy className="size-4" />
            </span>
        </button>
    );
}

export default function DepositCheckout({ reference }: { reference: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useTransaction(reference);
    const now = useNowSeconds();
    const status = data?.transaction.status;
    const [sawPending, setSawPending] = React.useState(false);

    if (status === "pending" && !sawPending) setSawPending(true);

    React.useEffect(() => {
        if (status !== "approved" || !sawPending) return;
        const timer = window.setTimeout(() => {
            window.close();
            window.setTimeout(() => router.replace("/account"), 300);
        }, 2500);
        return () => window.clearTimeout(timer);
    }, [status, sawPending, router]);

    React.useEffect(() => {
        const onEvent = (event: Event) => {
            const detail = (event as CustomEvent<{ transaction: { reference: string } }>).detail;
            if (detail?.transaction.reference === reference) void refetch();
        };
        window.addEventListener("mpb:transaction", onEvent);
        return () => window.removeEventListener("mpb:transaction", onEvent);
    }, [reference, refetch]);

    const method = (data?.transaction.method === "maya" ? "maya" : "gcash") as keyof typeof themes;
    const theme = themes[method];
    const logo = paymentMethods.find((item) => item.id === method)?.logo ?? "/gcash.png";
    const qr = data?.channel?.qr ? toAssetUrl(data.channel.qr) : theme.fallbackQr;
    const amount = Number(data?.transaction.amount ?? 0);
    const playerName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.name || "Player";
    const playerId = user?.id ? `MPB-${String(user.id).padStart(6, "0")}` : "";

    const expiresAt = data ? Math.floor(new Date(data.transaction.created_at).getTime() / 1000) + SESSION_MINUTES * 60 : 0;
    const remaining = now && expiresAt ? Math.max(0, expiresAt - now) : SESSION_MINUTES * 60;
    const expired = status === "pending" && now > 0 && remaining === 0;
    const timer = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
    const progress = remaining / (SESSION_MINUTES * 60);

    const steps = [
        { title: `Open ${theme.label}`, text: `Tap "Open in ${theme.label}" or launch the app on your phone.` },
        { title: "Scan the QR", text: "Use the QR Scanner, or upload the saved QR from your gallery." },
        { title: `Send exactly ${formatMoney(amount)}`, text: "Add your reference in the message so we can match it fast." },
        { title: "Stay on this tab", text: "It closes on its own and your balance updates instantly." },
    ];

    return (
        <div className="min-h-dvh bg-[#eef1f7] text-[#14213d]">
            <div className="relative overflow-hidden pb-28" style={{ background: `linear-gradient(135deg, ${theme.brand} 0%, ${theme.deep} 100%)` }}>
                <div className="pointer-events-none absolute -top-24 -right-20 size-80 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-3xl" />
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "22px 22px" }}
                />
                <div className="relative mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
                    <AppLogo href={null} inverted textClassName="hidden sm:inline" />
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/25">
                        <Lock className="size-3.5" /> Secure checkout
                    </span>
                </div>
                <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-2 text-center text-white sm:pt-4">
                    <span className="inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pr-5 pl-1.5 shadow-lg shadow-black/15">
                        <img src={logo} alt="" className="size-8 rounded-full object-contain" />
                        <span className="font-display text-lg font-extrabold" style={{ color: theme.brand }}>
                            {theme.label}
                        </span>
                    </span>
                    <h1 className="mt-4 max-w-md text-lg font-bold sm:text-xl">Securely complete the payment with your {theme.label} app</h1>
                </div>
            </div>

            <div className="relative mx-auto -mt-20 max-w-5xl px-4 pb-12 sm:px-6">
                <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_-30px_rgba(15,30,70,0.45)]">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3 py-24 text-sm text-slate-500">
                            <Loader2 className="size-8 animate-spin" style={{ color: theme.brand }} />
                            Preparing your payment…
                        </div>
                    ) : isError || !data ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
                            <XCircle className="size-12 text-red-500" />
                            <div className="text-xl font-extrabold">Payment not found</div>
                            <p className="text-sm text-slate-500">This request doesn&apos;t exist or belongs to another account.</p>
                            <Link href="/account/wallet" className="text-sm font-bold" style={{ color: theme.brand }}>
                                Back to wallet
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {status === "pending" ? (
                                <motion.div key="pending" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid md:grid-cols-[1fr_1.05fr]">
                                    <div className="order-2 space-y-5 border-t border-slate-100 p-5 sm:p-7 md:order-1 md:border-t-0 md:border-r">
                                        <div className="hidden items-center justify-between gap-3 md:flex">
                                            <div>
                                                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Amount to pay</div>
                                                <div className="font-display text-4xl font-extrabold" style={{ color: theme.deep }}>
                                                    {formatMoney(amount)}
                                                </div>
                                            </div>
                                            <div className={cn("rounded-2xl px-3 py-2 text-center", expired ? "bg-red-50 text-red-600" : "bg-slate-50")}>
                                                <div className="flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                                    <Clock3 className="size-3" /> {expired ? "Expired" : "Pay within"}
                                                </div>
                                                <div className="font-mono text-xl font-extrabold tabular-nums" style={!expired ? { color: theme.deep } : undefined}>
                                                    {timer}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                            <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${progress * 100}%`, backgroundColor: expired ? "#ef4444" : theme.brand }} />
                                        </div>

                                        <div className="space-y-2">
                                            <CopyField label="Exact amount" value={amount.toFixed(2)} mono accent={theme.deep} />
                                            <CopyField label="Reference · add to message" value={data.transaction.reference} mono />
                                        </div>

                                        <ol className="space-y-3">
                                            {steps.map((step, index) => (
                                                <li key={step.title} className="flex gap-3">
                                                    <span className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-extrabold text-white" style={{ backgroundColor: theme.brand }}>
                                                        {index + 1}
                                                    </span>
                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-bold">{step.title}</span>
                                                        <span className="block text-xs text-slate-500">{step.text}</span>
                                                    </span>
                                                </li>
                                            ))}
                                        </ol>

                                        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                            <ShieldCheck className="size-5 shrink-0 text-emerald-500" />
                                            <span className="min-w-0 text-xs text-slate-500">
                                                Paying as <span className="font-bold text-slate-800">{playerName}</span>
                                                {playerId ? <span className="font-mono"> · {playerId}</span> : null}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="order-1 flex flex-col items-center p-5 sm:p-7 md:order-2" style={{ backgroundColor: theme.soft }}>
                                        <div className="mb-4 flex w-full max-w-sm items-end justify-between md:hidden">
                                            <div>
                                                <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Amount to pay</div>
                                                <div className="font-display text-3xl font-extrabold" style={{ color: theme.deep }}>
                                                    {formatMoney(amount)}
                                                </div>
                                            </div>
                                            <div className={cn("flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-mono text-sm font-extrabold tabular-nums shadow-sm", expired && "text-red-600")}>
                                                <Clock3 className="size-3.5" /> {timer}
                                            </div>
                                        </div>
                                        <a
                                            href={theme.deepLink}
                                            className="flex h-14 w-full max-w-sm items-center justify-center gap-2 rounded-full text-lg font-bold text-white shadow-[0_12px_30px_-10px_rgba(10,91,216,0.7)] transition hover:brightness-110 active:scale-[0.99]"
                                            style={{ backgroundColor: theme.brand }}
                                        >
                                            <Smartphone className="size-5" /> Open in {theme.label}
                                        </a>

                                        <div className="my-5 flex w-full max-w-sm items-center gap-3 text-xs font-semibold text-slate-500">
                                            <span className="h-px flex-1 bg-slate-300/70" />
                                            or scan with the {theme.label} QR Scanner
                                            <span className="h-px flex-1 bg-slate-300/70" />
                                        </div>

                                        <div className="relative w-full max-w-[280px] rounded-3xl bg-white p-4 shadow-[0_20px_50px_-24px_rgba(15,30,70,0.5)]">
                                            {qr ? (
                                                <div className={cn("relative aspect-square overflow-hidden rounded-2xl", expired && "opacity-25 blur-[2px]")}>
                                                    <img src={qr} alt={`${theme.label} QR code`} className="size-full scale-[1.22] object-cover" />
                                                    {!expired ? (
                                                        <motion.span
                                                            className="pointer-events-none absolute inset-x-3 h-12 rounded-full"
                                                            style={{ background: `linear-gradient(to bottom, transparent, ${theme.brand}33, transparent)` }}
                                                            animate={{ top: ["0%", "85%", "0%"] }}
                                                            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                                                        />
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <div className="grid aspect-square place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                                                    <div>
                                                        <QrCode className="mx-auto mb-2 size-10 text-slate-300" />
                                                        QR code unavailable. Please contact support.
                                                    </div>
                                                </div>
                                            )}
                                            {(["top-2 left-2 border-t-4 border-l-4 rounded-tl-xl", "top-2 right-2 border-t-4 border-r-4 rounded-tr-xl", "bottom-2 left-2 border-b-4 border-l-4 rounded-bl-xl", "bottom-2 right-2 border-b-4 border-r-4 rounded-br-xl"] as const).map((corner) => (
                                                <span key={corner} className={cn("pointer-events-none absolute size-7", corner)} style={{ borderColor: theme.brand }} />
                                            ))}
                                            {expired ? (
                                                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                                                    <div>
                                                        <div className="text-sm font-extrabold text-slate-800">Payment window expired</div>
                                                        <Link href="/account/wallet" className="mt-1 inline-block text-xs font-bold" style={{ color: theme.brand }}>
                                                            Start a new deposit
                                                        </Link>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="mt-4 flex items-center gap-4 text-xs font-bold" style={{ color: theme.brand }}>
                                            {qr ? (
                                                <a href={qr} download={`${method}-qr.png`} className="inline-flex items-center gap-1.5 hover:underline">
                                                    <Download className="size-3.5" /> Save QR
                                                </a>
                                            ) : null}
                                            <span className="inline-flex items-center gap-1.5 text-slate-500">
                                                <ScanLine className="size-3.5" /> InstaPay supported
                                            </span>
                                        </div>

                                        <div className="mt-5 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                                            <span className="relative flex size-2.5">
                                                <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ backgroundColor: theme.brand }} />
                                                <span className="relative inline-flex size-2.5 rounded-full" style={{ backgroundColor: theme.brand }} />
                                            </span>
                                            Waiting for your payment…
                                        </div>
                                    </div>
                                </motion.div>
                            ) : status === "approved" ? (
                                <motion.div key="approved" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 260, damping: 16 }}
                                        className="grid size-20 place-items-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60"
                                    >
                                        <CheckCircle2 className="size-12 text-emerald-500" />
                                    </motion.span>
                                    <div className="mt-2 text-2xl font-extrabold">Payment received</div>
                                    <p className="text-sm text-slate-500">{formatMoney(amount)} was added to your ManpakBet balance.</p>
                                    {sawPending ? <p className="text-xs text-slate-400">Closing this tab…</p> : null}
                                    <Link href="/account" className="mt-2 rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ backgroundColor: theme.brand }}>
                                        Go to my account
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                                    <XCircle className="size-16 text-red-500" />
                                    <div className="text-2xl font-extrabold">Payment not completed</div>
                                    <p className="max-w-xs text-sm text-slate-500">{data.transaction.notes || "Contact support if you already sent the payment."}</p>
                                    <Link href="/account/wallet" className="mt-2 text-sm font-bold" style={{ color: theme.brand }}>
                                        Back to wallet
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
                <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="size-3.5" /> Payments are verified by ManpakBet. Never share your MPIN or OTP.
                </p>
            </div>
        </div>
    );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Download, Loader2, QrCode, ShieldCheck, XCircle } from "lucide-react";
import { AppToast } from "@/components/app";
import { paymentMethods } from "@/config/site";
import { useAuth } from "@/hooks/useAuth";
import { toAssetUrl } from "@/lib/assets";
import { formatMoney } from "@/lib/format";
import { useTransaction } from "@/lib/WalletAPI";

const themes = {
    gcash: { label: "GCash", brand: "#0a5bd8", deep: "#0646ad", soft: "#eaf1fd", deepLink: "gcash://" },
    maya: { label: "Maya", brand: "#00a85a", deep: "#007d43", soft: "#e6f7ee", deepLink: "paymaya://" },
} as const;

const copy = (value: string, label: string) => {
    void navigator.clipboard?.writeText(value);
    AppToast.success(`${label} copied`);
};

export default function DepositCheckout({ reference }: { reference: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const { data, isLoading, isError, refetch } = useTransaction(reference);
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

    return (
        <div className="min-h-dvh bg-[#eef0f5] text-[#1d2b4f]">
            <div className="h-44 sm:h-52" style={{ backgroundColor: theme.brand }}>
                <div className="mx-auto flex h-20 max-w-md items-center justify-center gap-2.5 px-4">
                    <span className="grid size-9 place-items-center rounded-full bg-white p-1">
                        <img src={logo} alt="" className="size-full object-contain" />
                    </span>
                    <span className="font-display text-2xl font-extrabold text-white">{theme.label}</span>
                </div>
            </div>

            <div className="mx-auto -mt-24 max-w-md px-4 pb-10 sm:-mt-28">
                <div className="rounded-3xl bg-white p-5 shadow-[0_20px_50px_-20px_rgba(15,30,70,0.35)] sm:p-7">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-3 py-16 text-sm text-slate-500">
                            <Loader2 className="size-7 animate-spin" style={{ color: theme.brand }} />
                            Preparing your payment…
                        </div>
                    ) : isError || !data ? (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <XCircle className="size-10 text-red-500" />
                            <div className="text-lg font-bold">Payment not found</div>
                            <p className="text-sm text-slate-500">This request doesn&apos;t exist or belongs to another account.</p>
                            <Link href="/account/wallet" className="text-sm font-bold" style={{ color: theme.brand }}>
                                Back to wallet
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            {status === "pending" ? (
                                <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center">
                                    <h1 className="text-[17px] leading-snug font-bold sm:text-lg">Securely complete the payment with your {theme.label} app</h1>

                                    <div className="mt-4 rounded-2xl px-4 py-3" style={{ backgroundColor: theme.soft }}>
                                        <div className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">Amount to pay</div>
                                        <div className="font-display text-3xl font-extrabold" style={{ color: theme.deep }}>
                                            {formatMoney(Number(data.transaction.amount))}
                                        </div>
                                    </div>

                                    <a
                                        href={theme.deepLink}
                                        className="mt-5 flex h-14 w-full items-center justify-center rounded-full text-lg font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                                        style={{ backgroundColor: theme.brand }}
                                    >
                                        Open in {theme.label}
                                    </a>

                                    <p className="mx-auto mt-6 max-w-xs text-sm font-semibold text-slate-600">or Log in to {theme.label} and scan this QR with the QR Scanner.</p>

                                    <div className="mx-auto mt-4 w-full max-w-[240px]">
                                        {data.channel?.qr ? (
                                            <img src={toAssetUrl(data.channel.qr)} alt={`${theme.label} QR code`} className="aspect-square w-full rounded-xl object-contain" />
                                        ) : (
                                            <div className="grid aspect-square w-full place-items-center rounded-xl border-2 border-dashed border-slate-200 p-4 text-xs text-slate-400">
                                                <div>
                                                    <QrCode className="mx-auto mb-2 size-10 text-slate-300" />
                                                    QR code is being prepared. Please contact support to complete this deposit.
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {data.channel?.qr ? (
                                        <a href={toAssetUrl(data.channel.qr)} download={`${method}-qr.png`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.brand }}>
                                            <Download className="size-3.5" /> Save QR to gallery
                                        </a>
                                    ) : null}

                                    <div className="mt-6 space-y-2 text-left">
                                        <button
                                            type="button"
                                            onClick={() => copy(data.transaction.reference, "Reference")}
                                            className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 transition hover:bg-slate-50"
                                        >
                                            <span className="min-w-0">
                                                <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">Reference · add to message</span>
                                                <span className="block truncate font-mono text-sm font-bold">{data.transaction.reference}</span>
                                            </span>
                                            <Copy className="size-4 shrink-0 text-slate-400" />
                                        </button>
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5">
                                            <ShieldCheck className="size-4 shrink-0 text-emerald-500" />
                                            <span className="min-w-0 text-xs text-slate-500">
                                                Paying as <span className="font-bold text-slate-700">{[user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.name}</span>
                                                {user?.id ? <span className="font-mono"> · MPB-{String(user.id).padStart(6, "0")}</span> : null}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
                                        <span className="relative flex size-2.5">
                                            <span className="absolute inline-flex size-full animate-ping rounded-full opacity-75" style={{ backgroundColor: theme.brand }} />
                                            <span className="relative inline-flex size-2.5 rounded-full" style={{ backgroundColor: theme.brand }} />
                                        </span>
                                        Waiting for payment. This tab closes automatically once received.
                                    </div>
                                </motion.div>
                            ) : status === "approved" ? (
                                <motion.div key="approved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-10 text-center">
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
                                        <CheckCircle2 className="size-16 text-emerald-500" />
                                    </motion.span>
                                    <div className="text-xl font-extrabold">Payment received</div>
                                    <p className="text-sm text-slate-500">{formatMoney(Number(data.transaction.amount))} was added to your ManpakBet balance.</p>
                                    {sawPending ? <p className="text-xs text-slate-400">Closing this tab…</p> : null}
                                    <Link href="/account" className="mt-2 text-sm font-bold" style={{ color: theme.brand }}>
                                        Go to my account
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div key="rejected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 py-10 text-center">
                                    <XCircle className="size-16 text-red-500" />
                                    <div className="text-xl font-extrabold">Payment not completed</div>
                                    <p className="max-w-xs text-sm text-slate-500">{data.transaction.notes || "Contact support if you already sent the payment."}</p>
                                    <Link href="/account/wallet" className="mt-2 text-sm font-bold" style={{ color: theme.brand }}>
                                        Back to wallet
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
                <p className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="size-3.5" /> Secured checkout for ManpakBet
                </p>
            </div>
        </div>
    );
}

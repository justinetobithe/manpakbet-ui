import Image from "next/image";
import Link from "next/link";
import { Clock3, Headphones, Mail, ShieldCheck, Zap } from "lucide-react";
import { AppLogo } from "@/components/app";
import { footerLinks, paymentMethods, siteConfig } from "@/config/site";

const assurances = [
    { icon: Zap, title: "Instant deposits", text: "GCash & Maya credited fast" },
    { icon: ShieldCheck, title: "Protected wallet", text: "Every request reviewed" },
    { icon: Clock3, title: "Same-day payouts", text: "Most cashouts within hours" },
    { icon: Headphones, title: "24/7 support", text: "Real people, any hour" },
];

export default function SiteFooter() {
    return (
        <footer className="relative mt-16 overflow-hidden border-t border-border bg-plum-950/80">
            <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-gold-400/6 blur-3xl" />

            <div className="relative mx-auto max-w-350 px-4 sm:px-5">
                <div className="grid grid-cols-2 gap-2.5 py-8 lg:grid-cols-4 lg:gap-4">
                    {assurances.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-3 rounded-2xl border border-border bg-white/2.5 p-3 sm:p-4">
                            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                                <Icon className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-[13px] font-bold sm:text-sm">{title}</div>
                                <div className="truncate text-[11px] text-muted-foreground sm:text-xs">{text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="divider-fade" />

                <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-8">
                    <div className="space-y-5 lg:col-span-4">
                        <AppLogo size="md" />
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{siteConfig.description}</p>
                        <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-gold-200">
                            <Mail className="size-4 text-gold-300" />
                            {siteConfig.supportEmail}
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
                        {footerLinks.map((group) => (
                            <div key={group.title} className="space-y-3.5">
                                <div className="text-[11px] font-bold tracking-[0.2em] text-gold-300/90 uppercase">{group.title}</div>
                                <ul className="space-y-2.5">
                                    {group.links.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className="text-sm text-foreground/65 transition hover:text-foreground">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3.5 lg:col-span-3">
                        <div className="text-[11px] font-bold tracking-[0.2em] text-gold-300/90 uppercase">Payment methods</div>
                        <div className="grid grid-cols-2 gap-2.5">
                            {paymentMethods.map((method) => (
                                <div key={method.id} className="flex items-center gap-2.5 rounded-2xl border border-border bg-white/3 p-2">
                                    <Image src={method.logo} alt={method.label} width={40} height={40} className="size-10 shrink-0 rounded-xl bg-white object-contain p-1" />
                                    <span className="text-sm font-bold">{method.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs leading-relaxed text-muted-foreground">Deposits and withdrawals are processed securely through GCash and Maya.</p>
                    </div>
                </div>

                <div className="divider-fade" />

                <div className="flex flex-col items-center gap-5 py-8 text-center lg:flex-row lg:justify-between lg:text-left">
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ember-500/70 font-display text-sm font-extrabold text-ember-400">21+</div>
                        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
                            Gaming can be addictive. Please play responsibly and set personal limits. Persons below {siteConfig.minAge}, government officials and
                            restricted persons are not allowed to play. Prohibition to play in open and public places.
                        </p>
                    </div>
                    <div className="shrink-0 rounded-xl border border-border bg-white/4 px-4 py-2.5">
                        <Image src="/pagcor-logo.svg" alt="PAGCOR" width={120} height={30} className="h-7 w-auto opacity-90" />
                    </div>
                </div>
            </div>

            <div className="relative border-t border-border bg-black/30">
                <div className="mx-auto flex max-w-350 flex-col items-center gap-2 px-4 pt-4 pb-24 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-5 lg:pb-4">
                    <span>
                        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                    </span>
                    <div className="flex items-center gap-4">
                        <Link href="/terms" className="hover:text-foreground">
                            Terms
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground">
                            Privacy
                        </Link>
                        <Link href="/support" className="hover:text-foreground">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

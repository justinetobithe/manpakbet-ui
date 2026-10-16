import Image from "next/image";
import Link from "next/link";
import { Clock3, Headphones, ShieldCheck, Zap } from "lucide-react";
import { AppLogo } from "@/components/app";
import { footerLinks, paymentMethods, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const assurances = [
    { icon: Zap, title: "Instant deposits", text: "Credits land in seconds" },
    { icon: ShieldCheck, title: "Protected wallet", text: "Encrypted, audited flows" },
    { icon: Clock3, title: "Fast payouts", text: "Most cashouts same day" },
    { icon: Headphones, title: "24/7 support", text: "Real humans, any hour" },
];

export default function SiteFooter() {
    return (
        <footer className="relative mt-16 border-t border-border bg-linear-to-b from-transparent to-black/40">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-5">
                <div className="grid grid-cols-2 gap-3 py-8 lg:grid-cols-4">
                    {assurances.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex items-center gap-3 rounded-2xl border border-border bg-white/2.5 p-3 sm:p-4">
                            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-400/12 text-gold-300 ring-1 ring-gold-400/20">
                                <Icon className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-bold">{title}</div>
                                <div className="truncate text-xs text-muted-foreground">{text}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="divider-fade" />

                <div className="grid gap-10 py-10 lg:grid-cols-[1.4fr_2fr]">
                    <div className="space-y-4">
                        <AppLogo size="md" />
                        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{siteConfig.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {paymentMethods.map((method) => (
                                <span key={method.id} className={cn("rounded-lg bg-linear-to-br px-3 py-1.5 text-xs font-bold ring-1 ring-white/10", method.tone)}>
                                    {method.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        {footerLinks.map((group) => (
                            <div key={group.title} className="space-y-3">
                                <div className="text-xs font-bold tracking-[0.18em] text-gold-300/90 uppercase">{group.title}</div>
                                <ul className="space-y-2">
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
                </div>

                <div className="divider-fade" />

                <div className="flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-ember-500/70 font-display text-sm font-extrabold text-ember-400">21+</div>
                        <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
                            Gaming can be addictive. Please play responsibly and set personal limits. Persons below {siteConfig.minAge}, government officials and
                            restricted persons are not allowed to play. Prohibition to play in open and public places.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl border border-border bg-white/4 px-3 py-2">
                            <Image src="/pagcor-logo.svg" alt="PAGCOR" width={120} height={30} className="h-7 w-auto opacity-90" />
                        </div>
                    </div>
                </div>

                <div className="pb-28 text-center text-xs text-muted-foreground lg:pb-8 lg:text-left">
                    © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

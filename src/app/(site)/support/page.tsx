import type { Metadata } from "next";
import Link from "next/link";
import { HeartHandshake, LifeBuoy, Mail, MessageCircle, ShieldCheck, Wallet } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AppCard, AppPageHeader } from "@/components/app";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Support Center" };

const faqs = [
    {
        q: "How do I create an account?",
        a: "Tap Join Now, then sign up with your email or verify your mobile number with a one-time code. New mobile numbers are registered automatically after verification.",
    },
    {
        q: "How long do deposits take?",
        a: "Deposits are credited as soon as the payment is verified, usually within a few minutes. You can track every request in Account → History.",
    },
    {
        q: "When will I receive my withdrawal?",
        a: "Most withdrawals are processed the same day. The amount is held from your balance while pending and returned automatically if a request is rejected.",
    },
    {
        q: "I didn't get my verification code.",
        a: "Wait 60 seconds, confirm your number starts with 09 or +63 and request a new code. Codes expire after five minutes for your security.",
    },
    {
        q: "How do promotions work?",
        a: "Each promotion lists its own eligibility, turnover and validity period. Open the promotion page for the full mechanics before claiming.",
    },
    {
        q: "How can I keep my account safe?",
        a: "Use a strong password, never share verification codes and log out on shared devices. Update your password anytime in Account → Profile.",
    },
];

const topics = [
    { icon: Wallet, title: "Wallet & payments", text: "Deposits, withdrawals and pending requests." },
    { icon: ShieldCheck, title: "Account security", text: "Passwords, verification codes and suspicious activity." },
    { icon: HeartHandshake, title: "Responsible gaming", text: "Limits, cool-off periods and self-exclusion help." },
];

export default function SupportPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <AppPageHeader eyebrow="We're here 24/7" icon={<LifeBuoy />} title="Support Center" description="Find quick answers or reach our team any time of day." />

            <div className="grid gap-3 sm:grid-cols-3">
                {topics.map(({ icon: Icon, title, text }) => (
                    <AppCard key={title} className="transition hover:border-gold-400/40">
                        <div className="mb-3 grid size-11 place-items-center rounded-xl bg-gold-400/15 text-gold-300 ring-1 ring-gold-400/25">
                            <Icon className="size-5" />
                        </div>
                        <div className="font-display font-bold">{title}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                    </AppCard>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <AppCard title="Frequently asked questions">
                    <Accordion type="single" collapsible className="-mt-2">
                        {faqs.map((item, index) => (
                            <AccordionItem key={item.q} value={`faq-${index}`}>
                                <AccordionTrigger>{item.q}</AccordionTrigger>
                                <AccordionContent>{item.a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </AppCard>

                <div className="space-y-3">
                    <AppCard glow title="Contact us" description="Average response time under 10 minutes.">
                        <div className="space-y-2.5">
                            <a href={`mailto:${siteConfig.supportEmail}`} className="flex items-center gap-3 rounded-xl border border-border bg-fg/3 p-3 transition hover:border-gold-400/40">
                                <Mail className="size-5 text-gold-300" />
                                <div>
                                    <div className="text-sm font-bold">Email</div>
                                    <div className="text-xs text-muted-foreground">{siteConfig.supportEmail}</div>
                                </div>
                            </a>
                            <div className="flex items-center gap-3 rounded-xl border border-border bg-fg/3 p-3">
                                <MessageCircle className="size-5 text-gold-300" />
                                <div>
                                    <div className="text-sm font-bold">Live chat</div>
                                    <div className="text-xs text-muted-foreground">Available for signed-in players</div>
                                </div>
                            </div>
                        </div>
                    </AppCard>
                    <AppCard title="Report a problem">
                        <p className="text-sm text-muted-foreground">
                            Include screenshots, your transaction reference, device type and the time it happened. Review our{" "}
                            <Link href="/terms" className="font-semibold text-gold-300 hover:underline">
                                Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="font-semibold text-gold-300 hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </AppCard>
                </div>
            </div>
        </div>
    );
}

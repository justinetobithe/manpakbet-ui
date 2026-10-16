import Image from "next/image";

export default function TermsPage() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <div className="surface rounded-3xl p-6">
                <h1 className="font-display text-3xl font-extrabold">Terms & Conditions</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Please read these Terms & Conditions carefully before using ManpakBet. By accessing or using the platform, you agree to be
                    bound by these terms.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-white/3 p-4">
                    <Image src="/pagcor.png" alt="PAGCOR" width={40} height={40} />
                    <div className="text-sm text-foreground/80">
                        Responsible gaming notice: Play responsibly and within your limits. Support is available for users who need help.
                    </div>
                </div>
            </div>

            <div className="surface rounded-3xl p-6 space-y-5">
                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">1. Eligibility</h2>
                    <p className="text-sm text-muted-foreground">
                        You must be of legal age in your jurisdiction to access or use this platform. You are responsible for ensuring compliance
                        with local laws and regulations.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">2. Account Registration</h2>
                    <p className="text-sm text-muted-foreground">
                        You may be required to register an account to access certain services. You agree to provide accurate information and keep
                        your details updated. You are responsible for any activity performed using your account.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">3. Security & Access</h2>
                    <p className="text-sm text-muted-foreground">
                        Do not share your verification codes, passwords, or login tokens with anyone. We may restrict access if we suspect fraud,
                        abuse, or unauthorized activity.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">4. Responsible Gaming</h2>
                    <p className="text-sm text-muted-foreground">
                        Gaming should be for entertainment. You agree not to use the platform in a way that harms yourself or others. If you feel
                        you are losing control, stop and seek support.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">5. Prohibited Activities</h2>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>Using the platform for unlawful purposes</li>
                        <li>Attempting to exploit, hack, or reverse engineer systems</li>
                        <li>Creating multiple accounts to abuse promotions</li>
                        <li>Providing false identity or payment information</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">6. Payments, Wallet, and Withdrawals</h2>
                    <p className="text-sm text-muted-foreground">
                        Wallet balances, deposits, and withdrawals may require verification. Transactions may be delayed due to security checks,
                        compliance reviews, or system maintenance.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">7. Promotions</h2>
                    <p className="text-sm text-muted-foreground">
                        Promotions may be changed, paused, or ended at any time. We may enforce fair-use limits, verification rules, and
                        eligibility requirements.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">8. Limitation of Liability</h2>
                    <p className="text-sm text-muted-foreground">
                        To the maximum extent permitted by law, ManpakBet is not liable for indirect, incidental, or consequential damages arising
                        from your use of the platform.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">9. Changes to Terms</h2>
                    <p className="text-sm text-muted-foreground">
                        We may update these terms from time to time. Continued use of the platform after changes indicates acceptance of the new
                        terms.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">10. Contact</h2>
                    <p className="text-sm text-muted-foreground">
                        For questions about these terms, visit the Support page or contact the platform support channels.
                    </p>
                </section>
            </div>
        </div>
    );
}

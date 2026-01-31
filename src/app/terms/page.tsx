import Image from "next/image";

export default function TermsPage() {
    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h1 className="text-2xl font-bold">Terms & Conditions</h1>
                <p className="mt-2 text-sm text-white/70">
                    Please read these Terms & Conditions carefully before using ManpakBet. By accessing or using the platform, you agree to be
                    bound by these terms.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <Image src="/pagcor.png" alt="PAGCOR" width={40} height={40} />
                    <div className="text-sm text-white/80">
                        Responsible gaming notice: Play responsibly and within your limits. Support is available for users who need help.
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">1. Eligibility</h2>
                    <p className="text-sm text-white/70">
                        You must be of legal age in your jurisdiction to access or use this platform. You are responsible for ensuring compliance
                        with local laws and regulations.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">2. Account Registration</h2>
                    <p className="text-sm text-white/70">
                        You may be required to register an account to access certain services. You agree to provide accurate information and keep
                        your details updated. You are responsible for any activity performed using your account.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">3. Security & Access</h2>
                    <p className="text-sm text-white/70">
                        Do not share your verification codes, passwords, or login tokens with anyone. We may restrict access if we suspect fraud,
                        abuse, or unauthorized activity.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">4. Responsible Gaming</h2>
                    <p className="text-sm text-white/70">
                        Gaming should be for entertainment. You agree not to use the platform in a way that harms yourself or others. If you feel
                        you are losing control, stop and seek support.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">5. Prohibited Activities</h2>
                    <ul className="list-disc pl-6 text-sm text-white/70 space-y-1">
                        <li>Using the platform for unlawful purposes</li>
                        <li>Attempting to exploit, hack, or reverse engineer systems</li>
                        <li>Creating multiple accounts to abuse promotions</li>
                        <li>Providing false identity or payment information</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">6. Payments, Wallet, and Withdrawals</h2>
                    <p className="text-sm text-white/70">
                        Wallet balances, deposits, and withdrawals may require verification. Transactions may be delayed due to security checks,
                        compliance reviews, or system maintenance.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">7. Promotions</h2>
                    <p className="text-sm text-white/70">
                        Promotions may be changed, paused, or ended at any time. We may enforce fair-use limits, verification rules, and
                        eligibility requirements.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">8. Limitation of Liability</h2>
                    <p className="text-sm text-white/70">
                        To the maximum extent permitted by law, ManpakBet is not liable for indirect, incidental, or consequential damages arising
                        from your use of the platform.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">9. Changes to Terms</h2>
                    <p className="text-sm text-white/70">
                        We may update these terms from time to time. Continued use of the platform after changes indicates acceptance of the new
                        terms.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">10. Contact</h2>
                    <p className="text-sm text-white/70">
                        For questions about these terms, visit the Support page or contact the platform support channels.
                    </p>
                </section>
            </div>
        </div>
    );
}

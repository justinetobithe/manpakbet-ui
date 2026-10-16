export default function PrivacyPage() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <div className="surface rounded-3xl p-6">
                <h1 className="font-display text-3xl font-extrabold">Privacy Policy</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This Privacy Policy explains how ManpakBet collects, uses, and protects your information.
                </p>
            </div>

            <div className="surface rounded-3xl p-6 space-y-5">
                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>Account information (phone number, email if provided)</li>
                        <li>Usage data (pages visited, actions, device info)</li>
                        <li>Security signals (IP address, fraud prevention indicators)</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">2. How We Use Information</h2>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                        <li>To provide, maintain, and improve services</li>
                        <li>To authenticate users and prevent fraud</li>
                        <li>To communicate important updates and security alerts</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">3. Data Security</h2>
                    <p className="text-sm text-muted-foreground">
                        We apply technical and organizational measures to protect your data. No method of transmission is 100% secure, but we
                        continuously improve safeguards.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">4. Cookies</h2>
                    <p className="text-sm text-muted-foreground">
                        We may use cookies and similar technologies for session management, performance analytics, and security protections.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">5. Your Rights</h2>
                    <p className="text-sm text-muted-foreground">
                        Depending on your jurisdiction, you may request access, correction, or deletion of personal data. Support can assist with
                        these requests.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="font-display text-lg font-bold text-gold-200">6. Updates</h2>
                    <p className="text-sm text-muted-foreground">
                        We may update this Privacy Policy periodically. Continued use of the platform means you accept the updated policy.
                    </p>
                </section>
            </div>
        </div>
    );
}

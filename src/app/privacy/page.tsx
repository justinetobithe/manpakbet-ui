export default function PrivacyPage() {
    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
                <p className="mt-2 text-sm text-white/70">
                    This Privacy Policy explains how ManpakBet collects, uses, and protects your information.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 text-sm text-white/70 space-y-1">
                        <li>Account information (phone number, email if provided)</li>
                        <li>Usage data (pages visited, actions, device info)</li>
                        <li>Security signals (IP address, fraud prevention indicators)</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">2. How We Use Information</h2>
                    <ul className="list-disc pl-6 text-sm text-white/70 space-y-1">
                        <li>To provide, maintain, and improve services</li>
                        <li>To authenticate users and prevent fraud</li>
                        <li>To communicate important updates and security alerts</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">3. Data Security</h2>
                    <p className="text-sm text-white/70">
                        We apply technical and organizational measures to protect your data. No method of transmission is 100% secure, but we
                        continuously improve safeguards.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">4. Cookies</h2>
                    <p className="text-sm text-white/70">
                        We may use cookies and similar technologies for session management, performance analytics, and security protections.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">5. Your Rights</h2>
                    <p className="text-sm text-white/70">
                        Depending on your jurisdiction, you may request access, correction, or deletion of personal data. Support can assist with
                        these requests.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">6. Updates</h2>
                    <p className="text-sm text-white/70">
                        We may update this Privacy Policy periodically. Continued use of the platform means you accept the updated policy.
                    </p>
                </section>
            </div>
        </div>
    );
}

import Link from "next/link";

export default function SupportPage() {
    return (
        <div className="mx-auto w-full max-w-3xl space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <h1 className="text-2xl font-bold">Support</h1>
                <p className="mt-2 text-sm text-white/70">
                    Need help? This page explains how to get support, report issues, and find answers quickly.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Quick Help</h2>
                    <ul className="list-disc pl-6 text-sm text-white/70 space-y-1">
                        <li>Login issues: check your phone number and request a new code</li>
                        <li>Wallet issues: verify your payment details and transaction status</li>
                        <li>Promo issues: confirm your eligibility and promo requirements</li>
                    </ul>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Account & Security</h2>
                    <p className="text-sm text-white/70">
                        If you suspect unauthorized activity, change your credentials and contact support immediately. Do not share OTP codes or
                        passwords.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Responsible Gaming</h2>
                    <p className="text-sm text-white/70">
                        If you feel that gaming is affecting your life, pause and seek help. We encourage responsible play and can provide
                        resources upon request.
                    </p>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Contact Options</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="text-sm font-semibold">Email</div>
                            <div className="mt-1 text-sm text-white/70">support@manpakbet.com</div>
                            <div className="mt-2 text-xs text-white/50">Response time may vary based on volume.</div>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="text-sm font-semibold">Help Center</div>
                            <div className="mt-1 text-sm text-white/70">FAQ and guides</div>
                            <div className="mt-2 text-xs text-white/50">
                                Review <Link className="underline hover:text-white" href="/terms">Terms</Link> and{" "}
                                <Link className="underline hover:text-white" href="/privacy">Privacy</Link>.
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-2">
                    <h2 className="text-lg font-semibold">Report a Problem</h2>
                    <p className="text-sm text-white/70">
                        Include screenshots, steps to reproduce, device type, and the time the issue happened. This helps support resolve issues
                        faster.
                    </p>
                </section>
            </div>
        </div>
    );
}

import Link from "next/link";
import { AppButton, AppLogoMark } from "@/components/app";

export default function NotFound() {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
            <AppLogoMark className="size-16 animate-float" />
            <div className="space-y-2">
                <div className="text-gold font-display text-7xl font-extrabold">404</div>
                <h1 className="font-display text-2xl font-extrabold">This table is closed</h1>
                <p className="max-w-sm text-sm text-muted-foreground">The page you&apos;re looking for has moved or never existed.</p>
            </div>
            <AppButton asChild size="lg" shine>
                <Link href="/">Return to lobby</Link>
            </AppButton>
        </div>
    );
}

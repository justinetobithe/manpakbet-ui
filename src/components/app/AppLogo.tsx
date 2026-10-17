import Link from "next/link";
import { cn } from "@/lib/utils";

type AppLogoProps = {
    href?: string | null;
    compact?: boolean;
    className?: string;
    size?: "sm" | "md" | "lg";
    textClassName?: string;
    inverted?: boolean;
};

const markSizes = { sm: "size-8", md: "size-9", lg: "size-12" };
const textSizes = { sm: "text-[17px]", md: "text-xl", lg: "text-3xl" };

export function AppLogoMark({ className }: { className?: string }) {
    const gold = "mpb-logo-gold";
    const ember = "mpb-logo-ember";

    return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <defs>
                <linearGradient id={gold} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fff1c2" />
                    <stop offset="0.45" stopColor="#ffc23d" />
                    <stop offset="1" stopColor="#e2830c" />
                </linearGradient>
                <linearGradient id={ember} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#ff5c93" />
                    <stop offset="1" stopColor="#b30d4c" />
                </linearGradient>
            </defs>
            <path d="M24 2.5 42.6 13.25v21.5L24 45.5 5.4 34.75v-21.5Z" fill="#170e27" stroke={`url(#${gold})`} strokeWidth="2.2" />
            <path d="M24 8.6 37.3 16.3v15.4L24 39.4 10.7 31.7V16.3Z" fill={`url(#${ember})`} opacity="0.22" />
            <path d="M13.5 32.5V16.8l6.2 7.6L24 17.6l4.3 6.8 6.2-7.6v15.7h-4.6v-7.3l-1.9 2.4L24 21.9l-4 5.7-1.9-2.4v7.3Z" fill={`url(#${gold})`} />
            <circle cx="24" cy="11.2" r="1.9" fill="#ff2e74" />
        </svg>
    );
}

export default function AppLogo({ href = "/", compact = false, className, size = "md", textClassName, inverted = false }: AppLogoProps) {
    const content = (
        <span className={cn("inline-flex items-center gap-2.5", className)}>
            <AppLogoMark className={cn("shrink-0 drop-shadow-[0_6px_18px_rgba(255,194,61,0.35)]", markSizes[size])} />
            {!compact ? (
                <span className={cn("font-display leading-none font-extrabold tracking-tight", textSizes[size], textClassName)}>
                    <span className={inverted ? "text-white" : "text-foreground"}>Manpak</span>
                    <span className="text-gold">Bet</span>
                </span>
            ) : null}
        </span>
    );

    if (!href) return content;

    return (
        <Link href={href} aria-label="ManpakBet home" className="inline-flex rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
            {content}
        </Link>
    );
}

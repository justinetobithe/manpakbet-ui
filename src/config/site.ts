import {
    BadgeCheck,
    BadgePercent,
    Banknote,
    Crown,
    Dices,
    Fish,
    Flame,
    Gamepad2,
    Gift,
    History,
    Home,
    Images,
    Layers,
    LayoutDashboard,
    LifeBuoy,
    Newspaper,
    Radio,
    Settings,
    ShieldCheck,
    Sparkles,
    Spade,
    Star,
    Trophy,
    UserRound,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react";
import type { Permission } from "@/types/User";

export const siteConfig = {
    name: "ManpakBet",
    tagline: "Play bold. Win brighter.",
    description: "ManpakBet is a modern online gaming lobby with slots, live tables, fishing arcades and sports, built for fast play and secure wallets.",
    supportEmail: "support@manpakbet.com",
    minAge: 21,
};

export type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    permission?: Permission;
    match?: string[];
};

export const primaryNav: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Slots", href: "/games/slot", icon: Dices },
    { label: "Live Casino", href: "/games/live", icon: Radio },
    { label: "Fishing", href: "/games/fishing", icon: Fish },
    { label: "Sports", href: "/games/sports", icon: Trophy },
    { label: "Poker", href: "/games/poker", icon: Spade },
    { label: "Promotions", href: "/promotions", icon: Gift },
];

export const secondaryNav: NavItem[] = [
    { label: "All Games", href: "/games", icon: Gamepad2 },
    { label: "News", href: "/news", icon: Newspaper },
    { label: "Support", href: "/support", icon: LifeBuoy },
];

export const bottomTabs: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Games", href: "/games", icon: Gamepad2 },
    { label: "Promos", href: "/promotions", icon: Gift },
    { label: "Account", href: "/account", icon: UserRound },
];

export const accountNav: NavItem[] = [
    { label: "Overview", href: "/account", icon: LayoutDashboard },
    { label: "Wallet", href: "/account/wallet", icon: Wallet },
    { label: "History", href: "/account/history", icon: History },
    { label: "Verification", href: "/account/verification", icon: BadgeCheck },
    { label: "Profile", href: "/account/profile", icon: UserRound },
];

export const adminNav: Array<{ title: string; items: NavItem[] }> = [
    {
        title: "Overview",
        items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view" }],
    },
    {
        title: "Players",
        items: [
            { label: "Accounts", href: "/admin/users", icon: Users, permission: "users.view" },
            { label: "KYC Review", href: "/admin/kyc", icon: BadgeCheck, permission: "kyc.review" },
        ],
    },
    {
        title: "Finance",
        items: [
            { label: "Cash In / Out", href: "/admin/transactions", icon: Banknote, permission: "transactions.view" },
            { label: "Bet History", href: "/admin/rounds", icon: Dices, permission: "transactions.view" },
        ],
    },
    {
        title: "Lobby",
        items: [
            { label: "Games", href: "/admin/games", icon: Gamepad2, permission: "games.manage" },
            { label: "Providers", href: "/admin/providers", icon: Crown, permission: "games.manage" },
            { label: "Categories", href: "/admin/categories", icon: Layers, permission: "games.manage" },
        ],
    },
    {
        title: "Content",
        items: [
            { label: "Banners", href: "/admin/banners", icon: Images, permission: "content.manage" },
            { label: "Promotions", href: "/admin/promotions", icon: BadgePercent, permission: "content.manage" },
            { label: "News", href: "/admin/news", icon: Newspaper, permission: "content.manage" },
        ],
    },
    {
        title: "System",
        items: [
            { label: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.manage" },
            { label: "Roles & Access", href: "/admin/roles", icon: ShieldCheck, permission: "roles.manage" },
        ],
    },
];

export const categoryIcons: Record<string, LucideIcon> = {
    flame: Flame,
    video: Radio,
    gamepad: Dices,
    sparkles: Sparkles,
    fish: Fish,
    trophy: Trophy,
    spade: Spade,
    star: Star,
    crown: Crown,
};

export const footerLinks = [
    {
        title: "Play",
        links: [
            { label: "All Games", href: "/games" },
            { label: "Slots", href: "/games/slot" },
            { label: "Live Casino", href: "/games/live" },
            { label: "Fishing", href: "/games/fishing" },
        ],
    },
    {
        title: "Rewards",
        links: [
            { label: "Promotions", href: "/promotions" },
            { label: "News & Events", href: "/news" },
            { label: "My Wallet", href: "/account/wallet" },
        ],
    },
    {
        title: "Help",
        links: [
            { label: "Support Center", href: "/support" },
            { label: "Terms & Conditions", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
        ],
    },
];

export const paymentMethods = [
    { id: "gcash", label: "GCash", logo: "/gcash.png", hint: "Instant e-wallet transfer", ring: "ring-sky-400/60" },
    { id: "maya", label: "Maya", logo: "/maya.png", hint: "Pay with your Maya wallet", ring: "ring-emerald-400/60" },
] as const;

export const BACKOFFICE_ROLES = ["admin", "staff"];

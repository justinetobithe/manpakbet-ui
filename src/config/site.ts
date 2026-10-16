import {
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
    { label: "History", href: "/account/transactions", icon: History },
    { label: "Profile", href: "/account/profile", icon: UserRound },
];

export const adminNav: Array<{ title: string; items: NavItem[] }> = [
    {
        title: "Overview",
        items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard, permission: "dashboard.view" }],
    },
    {
        title: "Operations",
        items: [
            { label: "Transactions", href: "/admin/transactions", icon: Banknote, permission: "transactions.view" },
            { label: "Players & Staff", href: "/admin/users", icon: Users, permission: "users.view" },
        ],
    },
    {
        title: "Lobby",
        items: [
            { label: "Games", href: "/admin/games", icon: Gamepad2, permission: "games.manage" },
            { label: "Categories", href: "/admin/categories", icon: Layers, permission: "games.manage" },
            { label: "Providers", href: "/admin/providers", icon: Crown, permission: "games.manage" },
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
        title: "Security",
        items: [{ label: "Roles & Access", href: "/admin/roles", icon: ShieldCheck, permission: "roles.manage" }],
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
    { id: "gcash", label: "GCash", tone: "from-sky-500/25 to-sky-400/5 text-sky-200" },
    { id: "maya", label: "Maya", tone: "from-emerald-500/25 to-emerald-400/5 text-emerald-200" },
    { id: "qrph", label: "QR Ph", tone: "from-fuchsia-500/25 to-fuchsia-400/5 text-fuchsia-200" },
    { id: "bank", label: "Bank Transfer", tone: "from-amber-500/25 to-amber-400/5 text-amber-200" },
] as const;

export const BACKOFFICE_ROLES = ["admin", "staff"];

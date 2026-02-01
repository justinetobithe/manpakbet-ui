import { Gamepad2, Newspaper, Percent, TvMinimalPlay, User } from "lucide-react";

export type NavItem = { href: string; label: string; icon: any };

export const NAV: NavItem[] = [
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/live-games", label: "Live Games", icon: TvMinimalPlay },
    { href: "/promo", label: "Promo", icon: Percent },
    { href: "/news", label: "News", icon: Newspaper },
    { href: "/account", label: "Account", icon: User },
];

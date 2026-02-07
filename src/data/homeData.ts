export const homeBanners = {
    main: {
        image: "/home/banner-main.png",
        href: "/games",
        alt: "Main Promo",
    },
    side: [
        {
            image: "/home/banner-side-1.png",
            href: "/games/live",
            alt: "Live Drops & Wins",
        },
        {
            image: "/home/banner-side-2.png",
            href: "/promo",
            alt: "Super Bonus",
        },
    ],
};

export type HomeGame = {
    id: string;
    title: string;
    image: string;
    href: string;
    badge?: "live" | "new" | "top";
};

export const homeSections: Array<{
    title: string;
    href?: string;
    games: HomeGame[];
}> = [
        {
            title: "Popular Games",
            href: "/games",
            games: [
                { id: "g1", title: "Color Game", image: "/home/game-01.png", href: "/games/color", badge: "live" },
                { id: "g2", title: "Dragon Tiger", image: "/home/game-02.png", href: "/games/dragon-tiger", badge: "new" },
                { id: "g3", title: "God of Wealth", image: "/home/game-03.png", href: "/games/god-of-wealth", badge: "live" },
                { id: "g4", title: "Enchanted Forest", image: "/home/game-04.png", href: "/games/enchanted-forest", badge: "top" },
            ],
        },
        {
            title: "Live Games",
            href: "/games/live",
            games: [
                { id: "g5", title: "Live Baccarat", image: "/home/game-05.png", href: "/games/live/baccarat", badge: "live" },
                { id: "g6", title: "Super Ace", image: "/home/game-06.png", href: "/games/live/super-ace", badge: "top" },
                { id: "g7", title: "Roulette Royale", image: "/home/game-07.png", href: "/games/live/roulette", badge: "live" },
                { id: "g8", title: "Blackjack", image: "/home/game-08.png", href: "/games/live/blackjack", badge: "top" },
            ],
        },
        {
            title: "Slot Games",
            href: "/games/slot",
            games: [
                { id: "g9", title: "Fortune Gems", image: "/home/game-09.png", href: "/games/slot/fortune-gems", badge: "live" },
                { id: "g10", title: "Slot Mania", image: "/home/game-10.png", href: "/games/slot/slot-mania", badge: "new" },
            ],
        },
        {
            title: "New Games",
            href: "/games/new",
            games: [
                { id: "g11", title: "Money Moose", image: "/home/game-11.png", href: "/games/new/money-moose", badge: "top" },
                { id: "g12", title: "Super Gods 7", image: "/home/game-12.png", href: "/games/new/super-gods-7", badge: "live" },
            ],
        },
    ];

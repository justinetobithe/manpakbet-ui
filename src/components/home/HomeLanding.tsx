"use client";

import { motion } from "framer-motion";
import { Clock3, Crown, Flame, Gift, Newspaper, Sparkles, Trophy } from "lucide-react";
import { AppSection } from "@/components/app";
import CategoryBar from "@/components/games/CategoryBar";
import GameRail from "@/components/games/GameRail";
import { useCategories, useGames, useProviders } from "@/lib/CasinoAPI";
import { useBanners, usePosts, usePromotions } from "@/lib/ContentAPI";
import { useGameStore } from "@/stores";
import CategoryTiles from "./CategoryTiles";
import FeatureBand from "./FeatureBand";
import HotSpotlight from "./HotSpotlight";
import HeroCarousel from "./HeroCarousel";
import LobbyStats from "./LobbyStats";
import PostCard from "./PostCard";
import PromoCard from "./PromoCard";
import ProviderMarquee from "./ProviderMarquee";
import SideBanners from "./SideBanners";
import TrendingBoard from "./TrendingBoard";

export default function HomeLanding() {
    const hero = useBanners("hero");
    const side = useBanners("side");
    const categories = useCategories(true);
    const providers = useProviders();
    const promotions = usePromotions();
    const posts = usePosts(undefined, 1, 4);
    const trending = useGames({ sort: "popular", per_page: 10 });
    const featured = useGames({ featured: true, per_page: 18 });
    const newest = useGames({ sort: "newest", per_page: 18 });
    const recentSlugs = useGameStore((state) => state.recent);
    const recent = useGames({ slugs: recentSlugs.slice(0, 18).join(","), per_page: 18 }, recentSlugs.length > 0);

    const recentOrdered = recent.data?.data.slice().sort((a, b) => recentSlugs.indexOf(a.slug) - recentSlugs.indexOf(b.slug));
    const totalGames = categories.data?.reduce((sum, category) => sum + (category.games_count ?? 0), 0) ?? 0;

    return (
        <div className="space-y-10 sm:space-y-12">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid gap-3 lg:grid-cols-[2.2fr_1fr]">
                <HeroCarousel banners={hero.data} loading={hero.isLoading} />
                <SideBanners banners={side.data} loading={side.isLoading} />
            </motion.div>

            <div className="space-y-4">
                <CategoryBar />
                <CategoryTiles categories={categories.data} loading={categories.isLoading} />
            </div>

            <HotSpotlight />

            <LobbyStats games={totalGames} providers={providers.data?.length ?? 0} categories={categories.data?.length ?? 0} promotions={promotions.data?.length ?? 0} />

            {recentOrdered?.length ? (
                <AppSection title="Continue playing" icon={<Clock3 />} href="/games?view=recent">
                    <GameRail games={recentOrdered} />
                </AppSection>
            ) : null}

            <AppSection title="Trending now" subtitle="Most played this week" icon={<Flame />} href="/games?sort=popular">
                <TrendingBoard games={trending.data?.data} loading={trending.isLoading} />
            </AppSection>

            {featured.data?.data.length || featured.isLoading ? (
                <AppSection title="Editor's picks" icon={<Crown />} href="/games">
                    <GameRail games={featured.data?.data} loading={featured.isLoading} />
                </AppSection>
            ) : null}

            {categories.data
                ?.filter((category) => category.slug !== "popular" && category.games?.length)
                .map((category) => (
                    <AppSection key={category.id} title={category.name} subtitle={`${category.games_count ?? 0} games`} icon={<Trophy />} href={`/games/${category.slug}`}>
                        <GameRail games={category.games} />
                    </AppSection>
                ))}

            <AppSection title="Fresh arrivals" icon={<Sparkles />} href="/games?sort=newest">
                <GameRail games={newest.data?.data} loading={newest.isLoading} />
            </AppSection>

            {promotions.data?.length ? (
                <AppSection title="Hot promotions" icon={<Gift />} href="/promotions">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {promotions.data.slice(0, 3).map((promotion, index) => (
                            <PromoCard key={promotion.id} promotion={promotion} index={index} />
                        ))}
                    </div>
                </AppSection>
            ) : null}

            {providers.data?.length ? (
                <AppSection title="Game studios" icon={<Crown />} href="/games">
                    <ProviderMarquee providers={providers.data} />
                </AppSection>
            ) : null}

            <FeatureBand />

            {posts.data?.data.length ? (
                <AppSection title="News & updates" icon={<Newspaper />} href="/news">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {posts.data.data.map((post, index) => (
                            <PostCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                </AppSection>
            ) : null}
        </div>
    );
}

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { crc32 } from "node:zlib";

const server = resolve(process.argv[2] ?? "../manpakbet-server");
const catalogPath = join(server, "database/data/casinoplus-games.json");
const imagesDir = join(server, "storage/app/public/games");
const publicDir = resolve("public/images/games");
const outFile = resolve("src/data/landing-games.json");

const HOT_GAMES = ["pinata-wins", "super-ace", "fortune-gems", "fortune-gems-2", "fortune-gems-3", "wild-bounty-showdown", "wild-ape3258", "golden-empire"];
const SPOTLIGHT = "pinata-wins";
const FEATURED_PROVIDERS = ["pg-soft", "jili", "pragmatic-play", "evolution"];
const NEW_GAMES_PER_PROVIDER = 3;
const CATEGORY_GAMES = 12;
const CATEGORIES = [
    { name: "Hot Games", slug: "popular", icon: "flame" },
    { name: "Slot Games", slug: "slot", icon: "gamepad" },
    { name: "Live Casino", slug: "live", icon: "video" },
    { name: "Fishing", slug: "fishing", icon: "fish" },
    { name: "New Games", slug: "new", icon: "sparkles" },
    { name: "Poker", slug: "poker", icon: "spade" },
    { name: "Sports", slug: "sports", icon: "trophy" },
].map((category, index) => ({ id: index + 1, ...category, sort_order: index + 1, is_active: true }));

if (!existsSync(catalogPath)) {
    console.error(`Catalog not found: ${catalogPath}`);
    process.exit(1);
}

mkdirSync(publicDir, { recursive: true });
const images = readdirSync(imagesDir).filter((file) => file.endsWith(".webp") && !file.endsWith("-banner.webp"));
images.forEach((file) => copyFileSync(join(imagesDir, file), join(publicDir, file)));
const available = new Set(images);

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const total = catalog.length;

const providerCounts = new Map();
catalog.forEach((game) => {
    const entry = providerCounts.get(game.provider_slug) ?? { name: game.provider, count: 0 };
    entry.count += 1;
    providerCounts.set(game.provider_slug, entry);
});
const providerOrder = [
    ...FEATURED_PROVIDERS.filter((slug) => providerCounts.has(slug)),
    ...[...providerCounts.entries()].sort((a, b) => b[1].count - a[1].count).map(([slug]) => slug).filter((slug) => !FEATURED_PROVIDERS.includes(slug)),
];
const providers = providerOrder.map((slug, index) => ({
    id: index + 1,
    name: providerCounts.get(slug).name,
    slug,
    logo: null,
    sort_order: index + 1,
    is_active: true,
    games_count: providerCounts.get(slug).count,
}));
const providerBySlug = new Map(providers.map((provider) => [provider.slug, provider]));
const categoryBySlug = new Map(CATEGORIES.map((category) => [category.slug, category]));

const sort = {};
const newPerProvider = {};
const games = catalog.map((entry, index) => {
    const hotIndex = HOT_GAMES.indexOf(entry.slug);
    let slug = hotIndex >= 0 ? "popular" : entry.category;

    if (slug === "slot" && (newPerProvider[entry.provider_slug] ?? 0) < NEW_GAMES_PER_PROVIDER && entry.rank > 40) {
        newPerProvider[entry.provider_slug] = (newPerProvider[entry.provider_slug] ?? 0) + 1;
        slug = "new";
    }

    sort[slug] = (sort[slug] ?? 0) + 1;
    const category = categoryBySlug.get(slug) ?? categoryBySlug.get("slot");
    const provider = providerBySlug.get(entry.provider_slug) ?? null;
    const file = `${entry.slug}.webp`;
    const image = available.has(file) ? `/images/games/${file}` : null;
    const plays = Math.max(120, Math.round(((total - entry.rank + 1) / total) * 48000) + (crc32(entry.slug) % 900));

    return {
        id: index + 1,
        game_category_id: category.id,
        game_provider_id: provider?.id ?? null,
        name: entry.name,
        slug: entry.slug,
        provider: entry.provider,
        thumbnail: image,
        banner: image,
        has_demo: !["live", "sports"].includes(entry.category),
        badge: hotIndex >= 0 ? "hot" : null,
        is_featured: hotIndex >= 0,
        plays_count: hotIndex < 0 ? plays : entry.slug === SPOTLIGHT ? 99800 : 60000 + (HOT_GAMES.length - hotIndex) * 3500,
        sort_order: hotIndex >= 0 ? hotIndex + 1 : sort[slug],
        is_active: true,
        category: { id: category.id, name: category.name, slug: category.slug },
        provider_ref: provider ? { id: provider.id, name: provider.name, slug: provider.slug, logo: null } : null,
    };
});

const tags = ["top", "new", "jackpot"];
games
    .filter((game) => game.badge !== "hot")
    .sort((a, b) => b.plays_count - a.plays_count)
    .slice(0, 60)
    .forEach((game, index) => {
        game.is_featured = index < 12;
        game.badge = index % 3 === 0 ? tags[index % tags.length] : null;
    });

const byPlays = (a, b) => b.plays_count - a.plays_count;
const bySort = (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name);

const categories = CATEGORIES.map((category) => {
    const members = games.filter((game) => game.game_category_id === category.id);
    return { ...category, games_count: members.length, games: members.sort(bySort).slice(0, CATEGORY_GAMES) };
});

const data = {
    categories,
    providers,
    hot: games.filter((game) => game.badge === "hot").sort(bySort),
    popular: [...games].sort(byPlays).slice(0, 24),
    featured: games.filter((game) => game.is_featured).sort(bySort).slice(0, 18),
    newest: [...games].sort((a, b) => b.id - a.id).slice(0, 18),
};

mkdirSync(resolve("src/data"), { recursive: true });
writeFileSync(outFile, JSON.stringify(data));
console.log(`Copied ${images.length} images to public/images/games and wrote ${outFile}`);

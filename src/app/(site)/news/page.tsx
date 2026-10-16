import type { Metadata } from "next";
import NewsView from "@/components/content/NewsView";

export const metadata: Metadata = { title: "News & Updates" };

export default function NewsPage() {
    return <NewsView />;
}

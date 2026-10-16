import AppBottomTabs from "@/components/AppBottomTabs";
import WalletDialog from "@/components/account/WalletDialog";
import AuthDialog from "@/components/auth/AuthDialog";
import AnnouncementBar from "./AnnouncementBar";
import DisclaimerDialog from "./DisclaimerDialog";
import MobileNav from "./MobileNav";
import SearchDialog from "./SearchDialog";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function SiteShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-grain relative flex min-h-dvh flex-col">
            <SiteHeader />
            <AnnouncementBar />
            <main className="mx-auto w-full max-w-[1400px] flex-1 px-3 pt-4 pb-6 sm:px-5 sm:pt-6">{children}</main>
            <SiteFooter />
            <AppBottomTabs />
            <MobileNav />
            <SearchDialog />
            <AuthDialog />
            <WalletDialog />
            <DisclaimerDialog />
        </div>
    );
}

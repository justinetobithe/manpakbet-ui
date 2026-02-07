"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthDialog({
    open,
    onOpenChange,
    initialMode = "login",
}: {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    initialMode?: "login" | "register";
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-[22px] border-white/10 bg-[linear-gradient(to_bottom,rgba(12,33,44,0.96),rgba(7,18,28,0.96))] p-0 text-white shadow-2xl shadow-black/50 backdrop-blur-xl sm:max-w-[980px]">
                <DialogHeader className="sr-only">
                    <DialogTitle>Authentication</DialogTitle>
                </DialogHeader>

                <AuthForm initialMode={initialMode} onDone={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

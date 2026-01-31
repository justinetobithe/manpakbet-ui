"use client";

import { useEffect, useState } from "react";
import { AuthDialog } from "@/components/auth-dialog";

export default function AuthPage() {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        setOpen(true);
    }, []);

    return <AuthDialog open={open} onOpenChange={setOpen} />;
}

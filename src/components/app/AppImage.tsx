"use client";

import * as React from "react";
import { FALLBACK_IMAGE, toAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

type AppImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src?: string | null;
    fallback?: string;
    wrapperClassName?: string;
};

export default function AppImage({ src, fallback = FALLBACK_IMAGE, alt = "", className, wrapperClassName, ...props }: AppImageProps) {
    const resolved = toAssetUrl(src);
    const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
    const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
    const current = failedSrc === resolved ? fallback : resolved;
    const loaded = loadedSrc === current;

    return (
        <span className={cn("relative block overflow-hidden bg-plum-800", wrapperClassName)}>
            {!loaded ? <span className="absolute inset-0 animate-pulse bg-linear-to-br from-fg/4 to-fg/8" /> : null}
            <img
                src={current}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoadedSrc(current)}
                onError={() => {
                    if (current !== fallback) setFailedSrc(resolved);
                    else setLoadedSrc(current);
                }}
                className={cn("h-full w-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
                {...props}
            />
        </span>
    );
}

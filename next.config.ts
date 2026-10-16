import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL) : null;

const nextConfig: NextConfig = {
    reactCompiler: true,
    poweredByHeader: false,
    images: {
        remotePatterns: [
            { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/**" },
            { protocol: "http", hostname: "localhost", port: "8000", pathname: "/**" },
            ...(apiUrl
                ? [
                      {
                          protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
                          hostname: apiUrl.hostname,
                          port: apiUrl.port,
                          pathname: "/**",
                      },
                  ]
                : []),
        ],
    },
    async redirects() {
        return [
            { source: "/promo", destination: "/promotions", permanent: true },
            { source: "/auth", destination: "/login", permanent: false },
            { source: "/dashboard", destination: "/account", permanent: false },
            { source: "/user/:path*", destination: "/account", permanent: false },
            { source: "/casino/:category", destination: "/games/:category", permanent: true },
        ];
    },
};

export default nextConfig;

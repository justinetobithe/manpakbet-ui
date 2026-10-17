"use client";

import axios from "axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
const KEY = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
const HOST = process.env.NEXT_PUBLIC_REVERB_HOST;
const PORT = Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080);
const SCHEME = process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http";

export const REALTIME_ENABLED = Boolean(KEY && HOST);

export type RealtimeTransaction = {
    id: number;
    reference: string;
    type: "deposit" | "withdraw" | "bonus" | "adjustment";
    method?: string | null;
    status: "pending" | "approved" | "rejected";
    amount: number;
    account_number?: string | null;
    notes?: string | null;
};

export type TransactionUpdatedEvent = {
    transaction: RealtimeTransaction;
    balance: number;
};

export type TransactionRequestedEvent = {
    transaction: Pick<RealtimeTransaction, "id" | "reference" | "type" | "method" | "amount"> & { created_at?: string };
    user?: { id: number; name: string } | null;
};

export const createEcho = (token: string) => {
    if (!REALTIME_ENABLED) return null;

    const pusher = Pusher;

    return new Echo<"reverb">({
        broadcaster: "reverb",
        Pusher: pusher,
        key: KEY,
        wsHost: HOST,
        wsPort: PORT,
        wssPort: PORT,
        forceTLS: SCHEME === "https",
        enabledTransports: ["ws", "wss"],
        authorizer: (channel: { name: string }) => ({
            authorize: (socketId: string, callback: (error: Error | null, data: { auth: string } | null) => void) => {
                axios
                    .post(
                        `${API_URL}/api/broadcasting/auth`,
                        { socket_id: socketId, channel_name: channel.name },
                        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
                    )
                    .then((response) => callback(null, response.data))
                    .catch((error: Error) => callback(error, null));
            },
        }),
    });
};

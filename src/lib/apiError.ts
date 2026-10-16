import axios from "axios";
import type ErrorMessage from "@/types/ErrorMessage";

export const apiFieldErrors = (err: unknown): Record<string, string> => {
    if (!axios.isAxiosError<ErrorMessage>(err)) return {};
    const errors = err.response?.data?.errors ?? {};
    return Object.fromEntries(Object.entries(errors).map(([key, value]) => [key, Array.isArray(value) ? value[0] : String(value)]));
};

const apiError = (err: unknown, fallback = "Something went wrong. Please try again."): string => {
    if (axios.isAxiosError<ErrorMessage>(err)) {
        if (!err.response) return err.code === "ECONNABORTED" ? "The request timed out." : "Unable to reach the server.";
        const message = err.response.data?.message;
        if (message) return message;
        return `${err.response.status} ${err.response.statusText}`.trim() || fallback;
    }

    if (err instanceof Error && err.message) return err.message;

    return fallback;
};

export default apiError;

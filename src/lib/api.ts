import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: { "X-Requested-With": "XMLHttpRequest" },
});

export async function getCsrfCookie() {
    await api.get("/sanctum/csrf-cookie");
}

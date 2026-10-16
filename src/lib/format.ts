const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 });
const pesoCompact = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", notation: "compact", maximumFractionDigits: 1 });
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const integer = new Intl.NumberFormat("en-PH");

export const formatMoney = (value: number | string | null | undefined) => peso.format(Number(value ?? 0));

export const formatMoneyCompact = (value: number | string | null | undefined) => pesoCompact.format(Number(value ?? 0));

export const formatCompact = (value: number | string | null | undefined) => compact.format(Number(value ?? 0));

export const formatNumber = (value: number | string | null | undefined) => integer.format(Number(value ?? 0));

export const formatDate = (value?: string | null, options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }) =>
    value ? new Intl.DateTimeFormat("en-PH", options).format(new Date(value)) : "—";

export const formatDateTime = (value?: string | null) =>
    formatDate(value, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

export const timeAgo = (value?: string | null) => {
    if (!value) return "—";
    const diff = (Date.now() - new Date(value).getTime()) / 1000;
    const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    for (const [unit, seconds] of units) {
        if (Math.abs(diff) >= seconds) return rtf.format(-Math.round(diff / seconds), unit);
    }
    return "just now";
};

export const initials = (name?: string | null) =>
    (name ?? "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "MB";

export const maskPhone = (phone?: string | null) => (phone ? `${phone.slice(0, 4)}•••${phone.slice(-3)}` : "—");

export const fullName = (user?: { first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null } | null) => {
    if (!user) return "—";
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
    return name || user.email || user.phone || "Player";
};

export const titleCase = (value?: string | null) =>
    (value ?? "").replace(/[-_.]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

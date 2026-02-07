import Link from "next/link";

export default function HomePage() {
    return (
        <div className="p-6 space-y-4">
            <div className="text-2xl font-semibold">Manpakbet</div>
            <div className="space-x-3">
                <Link className="underline" href="/games">Games</Link>
                <Link className="underline" href="/login">Login</Link>
                <Link className="underline" href="/register">Register</Link>
            </div>
        </div>
    );
}

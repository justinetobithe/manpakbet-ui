import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-0px)] flex items-center justify-center p-4">
            <AuthForm initialMode="login" />
        </div>
    );
}

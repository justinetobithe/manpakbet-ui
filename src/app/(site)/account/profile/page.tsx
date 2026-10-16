"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, UserRound } from "lucide-react";
import { AppButton, AppCard, AppPageHeader, AppTextField, AppToast } from "@/components/app";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { useMe, useUpdatePassword, useUpdateProfile } from "@/lib/ProfileAPI";

const profileSchema = z.object({
    first_name: z.string().trim().max(100),
    last_name: z.string().trim().max(100),
    email: z.union([z.literal(""), z.email("Enter a valid email")]),
    phone: z.union([z.literal(""), z.string().regex(/^(\+?63|0)?9\d{9}$/, "Enter a valid PH mobile number")]),
});

const passwordSchema = z
    .object({
        current_password: z.string().min(1, "Current password is required"),
        password: z.string().min(6, "At least 6 characters").max(100),
        password_confirmation: z.string(),
    })
    .refine((value) => value.password === value.password_confirmation, { path: ["password_confirmation"], message: "Passwords do not match" });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { data: me } = useMe();
    const { update } = useSession();
    const updateProfile = useUpdateProfile();
    const updatePassword = useUpdatePassword();

    const profileForm = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { first_name: "", last_name: "", email: "", phone: "" } });
    const passwordForm = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema), defaultValues: { current_password: "", password: "", password_confirmation: "" } });

    React.useEffect(() => {
        if (!me) return;
        profileForm.reset({ first_name: me.first_name ?? "", last_name: me.last_name ?? "", email: me.email ?? "", phone: me.phone ?? "" });
    }, [me, profileForm]);

    const saveProfile = profileForm.handleSubmit(async (values) => {
        try {
            const response = await updateProfile.mutateAsync({
                first_name: values.first_name || undefined,
                last_name: values.last_name || undefined,
                email: values.email || undefined,
                phone: values.phone || undefined,
            });
            await update({ user: { ...response.data } });
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => profileForm.setError(key as keyof ProfileValues, { message }));
            AppToast.error("Could not update profile", { description: apiError(err) });
        }
    });

    const savePassword = passwordForm.handleSubmit(async (values) => {
        try {
            const response = await updatePassword.mutateAsync(values);
            passwordForm.reset();
            AppToast.success(response.message);
        } catch (err) {
            Object.entries(apiFieldErrors(err)).forEach(([key, message]) => passwordForm.setError(key as keyof PasswordValues, { message }));
            AppToast.error("Could not update password", { description: apiError(err) });
        }
    });

    return (
        <div className="space-y-5">
            <AppPageHeader icon={<UserRound />} title="Profile & security" description="Keep your details current so payouts go smoothly." />
            <div className="grid gap-5 xl:grid-cols-2">
                <AppCard title="Personal details" icon={<UserRound />}>
                    <form onSubmit={saveProfile} className="space-y-3.5" noValidate>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <AppTextField control={profileForm.control} name="first_name" label="First name" />
                            <AppTextField control={profileForm.control} name="last_name" label="Last name" />
                        </div>
                        <AppTextField control={profileForm.control} name="email" label="Email" type="email" />
                        <AppTextField control={profileForm.control} name="phone" label="Mobile number" type="tel" prefix="🇵🇭" />
                        <AppButton type="submit" loading={profileForm.formState.isSubmitting}>
                            Save changes
                        </AppButton>
                    </form>
                </AppCard>
                <AppCard title="Change password" icon={<KeyRound />}>
                    <form onSubmit={savePassword} className="space-y-3.5" noValidate>
                        <AppTextField control={passwordForm.control} name="current_password" label="Current password" type="password" autoComplete="current-password" />
                        <AppTextField control={passwordForm.control} name="password" label="New password" type="password" autoComplete="new-password" />
                        <AppTextField control={passwordForm.control} name="password_confirmation" label="Confirm new password" type="password" autoComplete="new-password" />
                        <AppButton type="submit" tone="ember" loading={passwordForm.formState.isSubmitting}>
                            Update password
                        </AppButton>
                    </form>
                </AppCard>
            </div>
        </div>
    );
}

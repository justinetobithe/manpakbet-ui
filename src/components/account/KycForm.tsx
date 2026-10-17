"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, Camera, Check, ChevronLeft, ChevronRight, Clock3, FileImage, IdCard, MapPin, ShieldAlert, UserRound, X } from "lucide-react";
import { AppBadge, AppButton, AppCard, AppFieldShell, AppSelectField, AppTextField, AppToast } from "@/components/app";
import apiError, { apiFieldErrors } from "@/lib/apiError";
import { formatDate, formatDateTime } from "@/lib/format";
import { useKyc, useSubmitKyc } from "@/lib/ProfileAPI";
import { cn } from "@/lib/utils";
import type { KycFileType } from "@/types/Kyc";

const adultCutoff = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 21);
    return date.toISOString().slice(0, 10);
};

const schema = z.object({
    first_name: z.string().trim().min(1, "Required").max(100),
    middle_name: z.string().trim().max(100),
    last_name: z.string().trim().min(1, "Required").max(100),
    birthdate: z
        .string()
        .min(1, "Required")
        .refine((value) => value <= adultCutoff(), "You must be at least 21 years old"),
    nationality: z.string().trim().min(1, "Required").max(60),
    occupation: z.string().trim().max(100),
    source_of_funds: z.string(),
    address: z.string().trim().min(1, "Required").max(255),
    city: z.string().trim().min(1, "Required").max(100),
    province: z.string().trim().min(1, "Required").max(100),
    zip_code: z.string().trim().max(10),
    id_type: z.string().min(1, "Choose an ID type"),
    id_number: z.string().trim().min(3, "Enter your ID number").max(50),
});

type Values = z.infer<typeof schema>;

const steps = [
    { id: "personal", label: "Personal", icon: UserRound, fields: ["first_name", "middle_name", "last_name", "birthdate", "nationality", "occupation", "source_of_funds"] },
    { id: "address", label: "Address", icon: MapPin, fields: ["address", "city", "province", "zip_code"] },
    { id: "documents", label: "Documents", icon: IdCard, fields: ["id_type", "id_number"] },
] as const;

const fundOptions = [
    { label: "Salary", value: "salary" },
    { label: "Business", value: "business" },
    { label: "Savings", value: "savings" },
    { label: "Remittance", value: "remittance" },
    { label: "Pension", value: "pension" },
    { label: "Other", value: "other" },
];

const fileSlots: Array<{ key: KycFileType; label: string; hint: string; required: boolean; icon: React.ElementType }> = [
    { key: "id_front", label: "ID — front", hint: "All four corners visible", required: true, icon: IdCard },
    { key: "id_back", label: "ID — back", hint: "Optional for single-sided IDs", required: false, icon: FileImage },
    { key: "selfie", label: "Selfie holding your ID", hint: "Face and ID clearly visible", required: true, icon: Camera },
];

export default function KycForm() {
    const { data, isLoading } = useKyc();
    const submit = useSubmitKyc();
    const [step, setStep] = React.useState(0);
    const [files, setFiles] = React.useState<Partial<Record<KycFileType, File>>>({});
    const [fileErrors, setFileErrors] = React.useState<Partial<Record<KycFileType, string>>>({});
    const [restart, setRestart] = React.useState(false);

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            birthdate: "",
            nationality: "Filipino",
            occupation: "",
            source_of_funds: "",
            address: "",
            city: "",
            province: "",
            zip_code: "",
            id_type: "",
            id_number: "",
        },
    });

    const previews = React.useMemo(
        () => Object.fromEntries(Object.entries(files).map(([key, file]) => [key, file ? URL.createObjectURL(file) : ""])) as Partial<Record<KycFileType, string>>,
        [files]
    );

    React.useEffect(() => () => Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url)), [previews]);

    const next = async () => {
        const valid = await form.trigger(steps[step].fields as unknown as Array<keyof Values>);
        if (valid) setStep((value) => Math.min(value + 1, steps.length - 1));
    };

    const pickFile = (key: KycFileType, file?: File) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) return setFileErrors((current) => ({ ...current, [key]: "Upload an image file" }));
        if (file.size > 6 * 1024 * 1024) return setFileErrors((current) => ({ ...current, [key]: "Maximum size is 6 MB" }));
        setFileErrors((current) => ({ ...current, [key]: undefined }));
        setFiles((current) => ({ ...current, [key]: file }));
    };

    const onSubmit = form.handleSubmit(async (values) => {
        const missing = fileSlots.filter((slot) => slot.required && !files[slot.key]);
        if (missing.length) {
            setFileErrors(Object.fromEntries(missing.map((slot) => [slot.key, "This photo is required"])));
            return;
        }

        const payload = new FormData();
        Object.entries(values).forEach(([key, value]) => value && payload.append(key, value));
        Object.entries(files).forEach(([key, file]) => file && payload.append(key, file));

        try {
            const response = await submit.mutateAsync(payload);
            AppToast.success(response.message);
            setRestart(false);
        } catch (err) {
            const fieldErrors = apiFieldErrors(err);
            Object.entries(fieldErrors).forEach(([key, message]) => {
                if (key in values) form.setError(key as keyof Values, { message });
                else setFileErrors((current) => ({ ...current, [key]: message }));
            });
            const firstStep = steps.findIndex((item) => item.fields.some((field) => field in fieldErrors));
            if (firstStep >= 0) setStep(firstStep);
            AppToast.error("Submission failed", { description: apiError(err) });
        }
    });

    if (isLoading) return <div className="h-96 animate-pulse rounded-2xl bg-fg/5" />;

    const status = data?.status ?? "unverified";
    const submission = data?.submission;
    const showForm = status === "unverified" || (status === "rejected" && restart);

    if (!showForm) {
        return (
            <AppCard glow={status === "verified"}>
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <div
                        className={cn(
                            "grid size-20 place-items-center rounded-3xl ring-1",
                            status === "verified" && "bg-success/15 text-jade-400 ring-success/30",
                            status === "pending" && "bg-warning/15 text-amber-300 ring-warning/30",
                            status === "rejected" && "bg-destructive/15 text-red-300 ring-destructive/30"
                        )}
                    >
                        {status === "verified" ? <BadgeCheck className="size-10" /> : status === "pending" ? <Clock3 className="size-10" /> : <ShieldAlert className="size-10" />}
                    </div>
                    <div className="space-y-1">
                        <h2 className="font-display text-2xl font-extrabold">
                            {status === "verified" ? "You're verified" : status === "pending" ? "Documents under review" : "Verification declined"}
                        </h2>
                        <p className="mx-auto max-w-md text-sm text-muted-foreground">
                            {status === "verified"
                                ? "Your identity is confirmed. Withdrawals and all features are unlocked."
                                : status === "pending"
                                  ? "Our team is reviewing your documents. This usually takes less than 24 hours."
                                  : (submission?.rejection_reason ?? "Your documents could not be verified. Please submit clearer photos.")}
                        </p>
                    </div>
                    {submission ? (
                        <div className="grid w-full max-w-md grid-cols-2 gap-2 text-left text-sm">
                            <Info label="Name" value={`${submission.first_name} ${submission.last_name}`} />
                            <Info label="Birthdate" value={formatDate(submission.birthdate)} />
                            <Info label="ID" value={submission.id_type_label} />
                            <Info label="ID number" value={submission.masked_id_number} />
                            <Info label="Submitted" value={formatDateTime(submission.created_at)} />
                            <Info label="Reviewed" value={submission.reviewed_at ? formatDateTime(submission.reviewed_at) : "Waiting"} />
                        </div>
                    ) : null}
                    {status === "rejected" ? <AppButton onClick={() => setRestart(true)}>Submit again</AppButton> : null}
                </div>
            </AppCard>
        );
    }

    const current = steps[step];

    return (
        <AppCard>
            <div className="mb-6 grid grid-cols-3 gap-2">
                {steps.map((item, index) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => index < step && setStep(index)}
                        className={cn(
                            "flex items-center gap-2 rounded-xl border p-2.5 text-left transition sm:p-3",
                            index === step ? "border-gold-400/60 bg-gold-400/10" : index < step ? "border-success/40 bg-success/5" : "border-border opacity-60"
                        )}
                    >
                        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", index < step ? "bg-success/20 text-jade-400" : index === step ? "bg-gold text-[#2a1600]" : "bg-fg/6")}>
                            {index < step ? <Check className="size-4" /> : <item.icon className="size-4" />}
                        </span>
                        <span className="hidden min-w-0 sm:block">
                            <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Step {index + 1}</span>
                            <span className="block truncate text-sm font-bold">{item.label}</span>
                        </span>
                    </button>
                ))}
            </div>

            <form onSubmit={onSubmit} noValidate>
                <AnimatePresence mode="wait">
                    <motion.div key={current.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                        {current.id === "personal" ? (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <AppTextField control={form.control} name="first_name" label="First name" />
                                <AppTextField control={form.control} name="middle_name" label="Middle name" />
                                <AppTextField control={form.control} name="last_name" label="Last name" />
                                <AppTextField control={form.control} name="birthdate" label="Date of birth" type="date" />
                                <AppTextField control={form.control} name="nationality" label="Nationality" />
                                <AppTextField control={form.control} name="occupation" label="Occupation" />
                                <AppSelectField control={form.control} name="source_of_funds" label="Source of funds" options={fundOptions} allowEmpty className="sm:col-span-3" />
                            </div>
                        ) : current.id === "address" ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <AppTextField control={form.control} name="address" label="Street address" className="sm:col-span-2" />
                                <AppTextField control={form.control} name="city" label="City / Municipality" />
                                <AppTextField control={form.control} name="province" label="Province" />
                                <AppTextField control={form.control} name="zip_code" label="ZIP code" inputMode="numeric" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <AppSelectField control={form.control} name="id_type" label="Government ID" options={data?.id_types ?? []} />
                                    <AppTextField control={form.control} name="id_number" label="ID number" />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {fileSlots.map((slot) => (
                                        <AppFieldShell key={slot.key} label={`${slot.label}${slot.required ? "" : " (optional)"}`} hint={slot.hint} error={fileErrors[slot.key]}>
                                            <label
                                                className={cn(
                                                    "group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed bg-fg/3 text-center transition hover:border-gold-400/50",
                                                    fileErrors[slot.key] ? "border-destructive/60" : "border-border"
                                                )}
                                            >
                                                {previews[slot.key] ? (
                                                    <>
                                                        <img src={previews[slot.key]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                setFiles((filesState) => ({ ...filesState, [slot.key]: undefined }));
                                                            }}
                                                            className="glass absolute top-2 right-2 grid size-7 place-items-center rounded-full"
                                                            aria-label="Remove photo"
                                                        >
                                                            <X className="size-3.5" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <slot.icon className="size-7 text-gold-300" />
                                                        <span className="text-xs font-semibold text-foreground/80">Tap to upload</span>
                                                    </>
                                                )}
                                                <input type="file" accept="image/*" capture={slot.key === "selfie" ? "user" : undefined} className="hidden" onChange={(event) => pickFile(slot.key, event.target.files?.[0])} />
                                            </label>
                                        </AppFieldShell>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">Your documents are encrypted and only visible to our compliance team.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <AppButton type="button" tone="ghost" leftIcon={<ChevronLeft />} disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
                        Back
                    </AppButton>
                    {step < steps.length - 1 ? (
                        <AppButton type="button" rightIcon={<ChevronRight />} onClick={next}>
                            Continue
                        </AppButton>
                    ) : (
                        <AppButton type="submit" shine loading={submit.isPending} leftIcon={<BadgeCheck />}>
                            Submit for review
                        </AppButton>
                    )}
                </div>
            </form>
        </AppCard>
    );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-fg/3 p-2.5">
            <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{label}</div>
            <div className="truncate font-semibold">{value}</div>
        </div>
    );
}

export function KycStatusBadge({ status }: { status?: string | null }) {
    const tone = status === "verified" ? "success" : status === "pending" ? "warning" : status === "rejected" ? "danger" : "neutral";
    return (
        <AppBadge size="sm" tone={tone} dot>
            {status === "verified" ? "Verified" : status === "pending" ? "KYC pending" : status === "rejected" ? "KYC rejected" : "Unverified"}
        </AppBadge>
    );
}

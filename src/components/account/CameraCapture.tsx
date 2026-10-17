"use client";

import * as React from "react";
import { Camera, RefreshCcw, ScanFace } from "lucide-react";
import { AppButton, AppDialog } from "@/components/app";

type CameraCaptureProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCapture: (file: File) => void;
};

export default function CameraCapture({ open, onOpenChange, onCapture }: CameraCaptureProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const streamRef = React.useRef<MediaStream | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [ready, setReady] = React.useState(false);
    const [snapshot, setSnapshot] = React.useState<{ url: string; file: File } | null>(null);

    const stop = React.useCallback(() => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }, []);

    const start = React.useCallback(async () => {
        stop();
        setError(null);
        setReady(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
                setReady(true);
            }
        } catch {
            setError("We couldn't access your camera. Allow camera permission in your browser, or upload a photo instead.");
        }
    }, [stop]);

    React.useEffect(() => {
        if (!open) return;
        const timer = window.setTimeout(() => void start(), 50);
        return () => {
            window.clearTimeout(timer);
            stop();
        };
    }, [open, start, stop]);

    React.useEffect(() => () => {
        if (snapshot) URL.revokeObjectURL(snapshot.url);
    }, [snapshot]);

    const close = (next: boolean) => {
        if (!next) {
            stop();
            setSnapshot(null);
        }
        onOpenChange(next);
    };

    const capture = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
            (blob) => {
                if (!blob) return;
                const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
                setSnapshot({ url: URL.createObjectURL(blob), file });
                stop();
            },
            "image/jpeg",
            0.92
        );
    };

    const retake = () => {
        setSnapshot(null);
        void start();
    };

    const confirm = () => {
        if (!snapshot) return;
        onCapture(snapshot.file);
        close(false);
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={close}
            size="md"
            title="Selfie with your ID"
            description="Hold your ID beside your face. Make sure both are clear and well lit."
            footer={
                snapshot ? (
                    <>
                        <AppButton tone="ghost" leftIcon={<RefreshCcw />} onClick={retake}>
                            Retake
                        </AppButton>
                        <AppButton onClick={confirm}>Use this photo</AppButton>
                    </>
                ) : (
                    <>
                        <AppButton tone="ghost" onClick={() => close(false)}>
                            Cancel
                        </AppButton>
                        <AppButton leftIcon={<Camera />} onClick={capture} disabled={!ready}>
                            Capture
                        </AppButton>
                    </>
                )
            }
        >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0b0613]">
                {snapshot ? (
                    <img src={snapshot.url} alt="Captured selfie" className="h-full w-full object-cover" />
                ) : (
                    <>
                        <video ref={videoRef} playsInline muted className="h-full w-full -scale-x-100 object-cover" />
                        {ready ? (
                            <div className="pointer-events-none absolute inset-0">
                                <div className="absolute top-[12%] left-[14%] h-[68%] w-[38%] rounded-[50%] border-2 border-dashed border-white/80 shadow-[0_0_0_9999px_rgba(11,6,19,0.35)]" />
                                <div className="absolute top-[38%] right-[10%] h-[30%] w-[32%] rounded-xl border-2 border-dashed border-gold-200" />
                                <span className="absolute bottom-[8%] left-[18%] rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-white">Face here</span>
                                <span className="absolute right-[12%] bottom-[24%] rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold text-gold-200">ID here</span>
                            </div>
                        ) : null}
                        {!ready && !error ? (
                            <div className="absolute inset-0 grid place-items-center text-white/80">
                                <ScanFace className="size-10 animate-pulse" />
                            </div>
                        ) : null}
                        {error ? <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-white/85">{error}</div> : null}
                    </>
                )}
            </div>
        </AppDialog>
    );
}

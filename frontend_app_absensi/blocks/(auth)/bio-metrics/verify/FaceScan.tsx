"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { sanitizeText, safeNumber } from "@/utils/security";
import { useRouter } from "next/navigation";
import LoadingFaceModal from "@/components/LoadingFaceModal";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type VerifyResult = {
  success: boolean;
  message?: string;
  name?: string;
  score: number;
  type?: string;
  image?: string;
};

export default function VerifyFaceWeb() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const router = useRouter();

  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setPermission(true);
    } catch (err) {
      console.error("Camera error:", err);
      setPermission(false);
    }
  }, [facing, stopCamera]);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  async function takePicture() {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      setIsOpen(true);
      setResult(null);

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.8)
      );

      if (!blob) throw new Error("Image capture failed");

      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        `/api/auth/bio-metrics/verify`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      const res = await response.json();
      const data = res.result;

      const payload: VerifyResult = {
        success: Boolean(data?.success),
        name: sanitizeText(data?.name || "unknown"),
        score: safeNumber(data?.score),
        type: sanitizeText(data?.type || "unknown"),
        message: sanitizeText(data?.message),
        image: data?.image,
      };

      setResult(payload);

      setTimeout(() => {
        setIsOpen(false);
        if (payload.success) {
          stopCamera();
          router.push("/absensi/location");
        }
      }, 2000);

    } catch (err) {
      console.error("Capture error:", err);

      setResult({
        success: false,
        message: "Verification failed",
        score: 0,
      });

      setTimeout(() => {
        setIsOpen(false);
      }, 800);
    }
  }

  function toggleFacing() {
    setFacing((p) => (p === "user" ? "environment" : "user"));
  }

  function handleBack() {
    stopCamera();
    // kembali ke home (bukan /absensi yg justru render kamera lagi -> stuck)
    router.push("/home")
  }
  if (permission === false) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Camera permission denied
      </div>
    );
  }

  if (permission === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Requesting camera...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 text-white hover:cursor-pointer"
      >
        <ChevronLeft />
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-72 h-96 rounded-3xl border-4 border-white/80 shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          style={{
            boxShadow: `
              0 0 0 9999px rgba(255,255,255,0.35),
              0 0 25px rgba(255,255,255,0.5)
            `,
          }}
        />
      </div>

      {/* controls */}
      <div className="absolute bottom-10 w-full flex justify-around items-center">
        <div />

        <button
          onClick={takePicture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-white" />
        </button>

        <button
          onClick={toggleFacing}
          className="text-white text-2xl"
        >
          ⇄
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <LoadingFaceModal
        isOpen={isOpen}
        result={result}
      />
    </div>
  );
}
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CameraModalProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startStream() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
        setReady(false);
      } catch {
        if (!cancelled) {
          setError("Camera access was denied or is not available on this device.");
        }
      }
    }

    startStream();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [facingMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCapture(dataUrl);
  };

  const toggleCamera = () =>
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Video fills the screen */}
        <div className="relative flex-1 overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={() => setReady(true)}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </>
          )}

          {/* Close button — top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label="Close camera"
          >
            <Image src="/icons/x-white.svg" alt="" width={20} height={20} unoptimized />
          </button>

          {/* Flip button — top left */}
          <button
            type="button"
            onClick={toggleCamera}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            aria-label="Flip camera"
          >
            <Image src="/icons/flip-camera.svg" alt="" width={20} height={20} unoptimized />
          </button>
        </div>

        {/* Bottom bar with shutter */}
        <div className="flex items-center justify-center py-8 bg-black">
          <button
            type="button"
            onClick={handleCapture}
            disabled={!ready || !!error}
            aria-label="Capture photo"
            className="rounded-full bg-white ring-4 ring-white/30 hover:ring-white/60 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ width: "4.5rem", height: "4.5rem" }}
          />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </AnimatePresence>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PhotoModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function PhotoModal({ src, alt, onClose }: PhotoModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Image container */}
        <motion.div
          className="relative z-10 max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition"
            aria-label="Close"
          >
            <Image src="/icons/x-white.svg" alt="" width={14} height={14} unoptimized />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

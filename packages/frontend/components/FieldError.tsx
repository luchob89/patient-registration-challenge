"use client";

import { AnimatePresence, motion } from "framer-motion";

interface FieldErrorProps {
  message?: string;
}

export default function FieldError({ message }: FieldErrorProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -4 }}
          animate={{
            opacity: 1,
            y: 0,
            textShadow: [
              "0 0 8px rgba(239,68,68,0.9)",
              "0 0 4px rgba(239,68,68,0.4)",
              "0 0 0px rgba(239,68,68,0)",
            ],
          }}
          exit={{ opacity: 0, y: -4 }}
          transition={{
            opacity: { duration: 0.15, ease: "easeOut" },
            y: { duration: 0.15, ease: "easeOut" },
            textShadow: { duration: 1.5, ease: "easeOut", times: [0, 0.3, 1] },
          }}
          className="text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

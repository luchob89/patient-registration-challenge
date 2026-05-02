"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
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
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Card */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl px-8 py-8 flex flex-col items-center gap-5 w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {/* Icon */}
          <motion.div
            className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.1 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </motion.div>

          {/* Text */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-400 mt-1">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full pt-1">
            <Button
              value="Cancel"
              variant="secondary"
              onPress={onCancel}
              type="button"
              className="flex-1"
            />
            <Button
              value={confirmLabel}
              variant="danger"
              onPress={onConfirm}
              type="button"
              className="flex-1"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

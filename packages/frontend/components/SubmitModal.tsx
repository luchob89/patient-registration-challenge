"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface SubmitModalProps {
  status: "success" | "error";
  message?: string;
  onAddAnother: () => void;
  onViewPatients: () => void;
  onClose?: () => void;
}

export default function SubmitModal({
  status,
  message,
  onAddAnother,
  onViewPatients,
  onClose,
}: SubmitModalProps) {
  const isSuccess = status === "success";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

        {/* Card */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6 w-full max-w-sm"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {/* Close button — error only */}
          {!isSuccess && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {/* Icon circle */}
          <motion.div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-indigo-100" : "bg-red-100"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.12 }}
          >
            {isSuccess ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.28, ease: "easeOut" }}
                />
              </svg>
            ) : (
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                initial={{ rotate: -12, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.16 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            )}
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.22 }}
          >
            <h2 className="text-xl font-semibold text-indigo-900 mb-2">
              {isSuccess ? "Patient registered!" : "Registration failed"}
            </h2>
            <p className="text-sm text-indigo-500">
              {message ??
                (isSuccess
                  ? "The patient's information has been saved successfully."
                  : "Something went wrong. Please try again.")}
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col gap-2 w-full"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
          >
            <Button
              value="Add another patient"
              onPress={onAddAnother}
              className="w-full"
            />
            <Button
              value="View all patients"
              variant="secondary"
              onPress={onViewPatients}
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

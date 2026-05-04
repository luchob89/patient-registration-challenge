"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import type { Patient } from "./PatientCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface EditModalProps {
  patient: Patient;
  onClose: () => void;
  onSaved: (updated: Patient) => void;
}

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (form.firstName.trim().length < 2)
    errors.firstName = "At least 2 characters.";
  if (form.lastName.trim().length < 2)
    errors.lastName = "At least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Invalid email address.";
  if (!/^\d{6,15}$/.test(form.phone))
    errors.phone = "6–15 digits only.";

  return errors;
}

export default function EditModal({ patient, onClose, onSaved }: EditModalProps) {
  const [form, setForm] = useState<FormState>({
    firstName: patient.firstName,
    lastName: patient.lastName,
    email: patient.email,
    countryCode: patient.countryCode,
    phone: patient.phone,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitState, setSubmitState] = useState<"idle" | "saving" | "error">("idle");

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitState("saving");
    try {
      const { data } = await axios.patch<{ data: Patient }>(
        `${API_URL}/patients/${patient.id}`,
        form
      );
      onSaved(data.data);
      onClose();
    } catch {
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 3000);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition";
  const errorClass = "text-xs text-red-500 mt-0.5";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

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
          onClick={onClose}
        />

        {/* Card */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl px-8 py-7 flex flex-col gap-5 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Image src="/icons/pencil.svg" alt="" width={18} height={18} unoptimized className="text-yellow-600" style={{ filter: "invert(60%) sepia(80%) saturate(500%) hue-rotate(5deg)" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Edit Patient</h2>
              <p className="text-xs text-gray-400">{patient.firstName} {patient.lastName}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto p-1.5 rounded-full hover:bg-gray-100 transition"
              aria-label="Close"
            >
              <Image src="/icons/x-white.svg" alt="" width={14} height={14} unoptimized style={{ filter: "invert(40%)" }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* First name + Last name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className={labelClass}>First name</label>
                <input
                  className={inputClass}
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="First name"
                />
                {fieldErrors.firstName && <p className={errorClass}>{fieldErrors.firstName}</p>}
              </div>
              <div className="flex-1">
                <label className={labelClass}>Last name</label>
                <input
                  className={inputClass}
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Last name"
                />
                {fieldErrors.lastName && <p className={errorClass}>{fieldErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={set("email")}
                placeholder="email@example.com"
              />
              {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
            </div>

            {/* Country code + Phone */}
            <div className="flex gap-3">
              <div className="w-32">
                <label className={labelClass}>Country code</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-sm font-medium text-gray-400 pointer-events-none select-none">+</span>
                  <input
                    className={`${inputClass} pl-6`}
                    value={form.countryCode}
                    onChange={set("countryCode")}
                    placeholder="1"
                    type="tel"
                    inputMode="numeric"
                    maxLength={4}
                    onKeyDown={(e) => { if (/^[a-zA-Z]$/.test(e.key)) e.preventDefault(); }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className={labelClass}>Phone</label>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="123456789"
                  inputMode="numeric"
                />
                {fieldErrors.phone && <p className={errorClass}>{fieldErrors.phone}</p>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitState === "saving"}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
                  ${submitState === "error"
                    ? "bg-red-100 text-red-600 border border-red-200 focus:ring-red-300"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-400"
                  }`}
              >
                {submitState === "saving" ? "Saving…" : submitState === "error" ? "Failed — retry" : "Save changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

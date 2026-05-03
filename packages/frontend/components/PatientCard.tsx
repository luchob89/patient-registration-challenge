"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import DetailRow from "./DetailRow";
import ConfirmModal from "./ConfirmModal";
import PhotoModal from "./PhotoModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  createdAt: string;
  photoUrl: string;
}

export default function PatientCard({
  patient,
  index,
  onDeleted,
}: {
  patient: Patient;
  index: number;
  onDeleted?: (id: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [deleteState, setDeleteState] = useState<"idle" | "deleting" | "error">("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  const registered = new Date(patient.createdAt).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleResendEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (emailState === "sending") return;
    setEmailState("sending");
    try {
      await axios.post(`${API_URL}/patients/${patient.id}/resend-email`);
      setEmailState("sent");
      setTimeout(() => setEmailState("idle"), 3000);
    } catch {
      setEmailState("error");
      setTimeout(() => setEmailState("idle"), 3000);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (deleteState === "deleting") return;
    setDeleteState("deleting");
    try {
      await axios.delete(`${API_URL}/patients/${patient.id}`);
      onDeleted?.(patient.id);
    } catch {
      setDeleteState("error");
      setTimeout(() => setDeleteState("idle"), 3000);
    }
  };

  return (
    <>
      {zoomOpen && (
        <PhotoModal
          src={patient.photoUrl}
          alt={`${patient.firstName} ${patient.lastName}`}
          onClose={() => setZoomOpen(false)}
        />
      )}
      {confirmOpen && (
        <ConfirmModal
          title="Delete patient?"
          message={`${patient.firstName} ${patient.lastName} will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          layout: { type: "spring", stiffness: 280, damping: 28 },
          opacity: { delay: index * 0.04, duration: 0.3 },
          y: { delay: index * 0.04, duration: 0.3 },
        }}
        className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 shadow-sm overflow-hidden select-none"
      >
        {/* Document photo */}
        <motion.div
          layout
          onClick={() => setOpen((v) => !v)}
          className="relative aspect-[3/4] overflow-hidden bg-slate-100 cursor-pointer group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={patient.photoUrl}
            alt={`${patient.firstName} ${patient.lastName}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Zoom button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setZoomOpen(true); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-black/50 transition"
            aria-label="View full size"
          >
            <Image src="/icons/zoom.svg" alt="" width={16} height={16} unoptimized className="invert" />
          </button>
        </motion.div>

        {/* Name + chevron */}
        <motion.div
          layout="position"
          onClick={() => setOpen((v) => !v)}
          className="px-3 py-2.5 flex items-center justify-between gap-2 cursor-pointer"
        >
          <span className="font-semibold text-md text-gray-800 truncate">
            {patient.firstName} {patient.lastName}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="shrink-0"
          >
            <Image src="/icons/chevron-down.svg" alt="" width={16} height={16} unoptimized />
          </motion.span>
        </motion.div>

        {/* Expanded details */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="border-t border-gray-100 px-3 pb-3 pt-2 space-y-2"
            >
              <DetailRow iconSrc="/icons/email.svg" label={patient.email} />
              <DetailRow
                iconSrc="/icons/phone.svg"
                label={`+${patient.countryCode} ${patient.phone}`}
              />
              <p className="text-xs text-gray-400 px-2 mt-4">
                <span className="font-medium">Created: </span>
                {registered}
              </p>

              {/* Action buttons */}
              <div className="flex flex-col gap-1.5 pt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={emailState === "sending"}
                  className={`w-full flex items-center justify-center gap-2 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    emailState === "sent"
                      ? "bg-green-50 text-green-600 border-green-200 focus:ring-green-300"
                      : emailState === "error"
                        ? "bg-red-50 text-red-500 border-red-200 focus:ring-red-300"
                        : "bg-sky-100/70 text-indigo-800 border-sky-300 hover:bg-sky-300/70 focus:ring-sky-300"
                  }`}
                >
                  <Image src="/icons/send.svg" alt="" width={12} height={12} unoptimized />
                  {emailState === "sending"
                    ? "Sending…"
                    : emailState === "sent"
                      ? "Email sent!"
                      : emailState === "error"
                        ? "Failed — retry"
                        : "Resend Email"}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteState === "deleting"}
                  className={`w-full flex items-center justify-center gap-2 text-xs px-3 py-1.5 rounded-lg font-semibold border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    deleteState === "error"
                      ? "bg-red-100 text-red-700 border-red-300 focus:ring-red-300"
                      : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 focus:ring-red-300"
                  }`}
                >
                  <Image src="/icons/trash.svg" alt="" width={15} height={15} unoptimized />
                  {deleteState === "deleting"
                    ? "Deleting…"
                    : deleteState === "error"
                      ? "Failed — retry"
                      : "Delete User"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

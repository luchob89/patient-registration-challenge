"use client";

import Image from "next/image";
import axios from "axios";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  resetPatient,
  setDocumentPhoto,
} from "../../../store/slices/patientSlice";
import { useFormContext } from "../context/FormContext";
import Button from "../../../components/Button";
import CameraModal from "../../../components/CameraModal";
import FieldError from "../../../components/FieldError";
import SubmitModal from "../../../components/SubmitModal";
import { useNavigate } from "../../../navigation/PageTransition";
import { applyRotation, dataUrlToBlob } from "../../../lib/imageHelpers";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = { "image/jpeg": [".jpg", ".jpeg"] };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function StepPhoto() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { goPrev, resetStep } = useFormContext();

  const { firstName, lastName, email, phoneCountryCode, phone } =
    useAppSelector((s) => s.patient);

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(
    null
  );
  const [modalMessage, setModalMessage] = useState<string | undefined>();

  const rotatePhoto = () => setRotation((prev) => (prev + 90) % 360);

  const onDrop = useCallback(
    (accepted: File[], rejected: import("react-dropzone").FileRejection[]) => {
      setError(null);

      if (rejected.length > 0) {
        const code = rejected[0].errors[0].code;
        if (code === "file-too-large") setError("File exceeds the 5 MB limit.");
        else if (code === "file-invalid-type")
          setError("Only JPEG images (.jpg) are accepted.");
        else setError("Invalid file. Please try again.");
        return;
      }

      const file = accepted[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
  });

  const handleCameraCapture = (dataUrl: string) => {
    setCameraOpen(false);
    setPreview(dataUrl);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!preview) {
      setError("Please upload a document photo before continuing.");
      return;
    }

    setSubmitting(true);
    try {
      const rotatedDataUrl = await applyRotation(preview, rotation);
      dispatch(setDocumentPhoto(rotatedDataUrl));

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("countryCode", phoneCountryCode);
      // phone in Redux is `+{countryCode}{number}` — strip the prefix
      const phoneNumber = phone.slice(phoneCountryCode.length + 1);
      formData.append("phone", phoneNumber);
      formData.append("photo", dataUrlToBlob(rotatedDataUrl), "photo.jpg");

      await axios.post(`${API_URL}/patients`, formData);
      setModalStatus("success");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors as Record<string, string[]>;
        const first = Object.values(errors).flat()[0];
        setModalMessage(first);
      }
      setModalStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    dispatch(resetPatient());
    setModalStatus(null);
    resetStep();
  };

  const handleViewPatients = () => {
    dispatch(resetPatient());
    navigate("/patients");
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setRotation(0);
  };

  return (
    <>
      {modalStatus && (
        <SubmitModal
          status={modalStatus}
          message={modalMessage}
          onAddAnother={handleAddAnother}
          onViewPatients={handleViewPatients}
          onClose={() => setModalStatus(null)}
        />
      )}
      {cameraOpen && (
        <CameraModal
          onCapture={handleCameraCapture}
          onClose={() => setCameraOpen(false)}
        />
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-indigo-700">
            Document Photo
          </label>

          {!preview ? (
            <div
              {...getRootProps()}
              className={`rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors duration-300
              ${isDragActive ? "border-indigo-400 bg-indigo-50" : "border-indigo-200 bg-white/60 hover:border-indigo-300 hover:bg-indigo-50/50"}
            `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2 pointer-events-none">
                <Image
                  src="/icons/upload.svg"
                  alt=""
                  width={40}
                  height={40}
                  unoptimized
                />
                {isDragActive ? (
                  <p className="text-sm text-indigo-500 font-medium">
                    Drop the image here…
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-indigo-500 font-medium">
                      Drag & drop an image here, or{" "}
                      <span className="underline">click to browse</span>
                    </p>
                    <p className="text-xs text-indigo-300">
                      JPEG (.jpg) · Max 5 MB
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-indigo-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Document preview"
                className="w-full h-48 object-cover transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
              {/* Rotate button */}
              <button
                type="button"
                onClick={rotatePhoto}
                className="absolute top-2 left-2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-colors duration-200"
                aria-label="Rotate photo"
              >
                <Image
                  src="/icons/rotate.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
              </button>
              {/* Remove button */}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow transition-colors duration-200"
                aria-label="Remove photo"
              >
                <Image
                  src="/icons/x-red.svg"
                  alt=""
                  width={16}
                  height={16}
                  unoptimized
                />
              </button>
            </div>
          )}

          {error && <FieldError message={error} />}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            value="Use Camera 📷"
            variant="tertiary"
            onPress={() => setCameraOpen(true)}
            type="button"
            className="w-full"
          />
          <div className="flex justify-between">
            <Button
              value="Back"
              variant="secondary"
              onPress={goPrev}
              type="button"
              disabled={submitting}
            />
            <Button
              value={submitting ? "Submitting…" : "Submit"}
              onPress={handleSubmit}
              type="button"
              disabled={submitting}
            />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { createContext, useContext, useState } from "react";

export const TOTAL_STEPS = 4;

interface FormContextValue {
  currentStep: number;
  goNext: () => void;
  goPrev: () => void;
  resetStep: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export function FormContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState(1);

  const goNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const resetStep = () => setCurrentStep(1);

  return (
    <FormContext value={{ currentStep, goNext, goPrev, resetStep }}>
      {children}
    </FormContext>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx)
    throw new Error("useFormContext must be used inside FormContextProvider");
  return ctx;
}

"use client";

import {
  FormContextProvider,
  TOTAL_STEPS,
  useFormContext,
} from "./context/FormContext";

const STEP_LABELS = ["Name", "Email", "Phone", "Photo"];

function StepBar() {
  const { currentStep } = useFormContext();

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300
                  ${isCompleted ? "bg-indigo-500 text-white" : ""}
                  ${isActive ? "bg-indigo-400 text-white ring-4 ring-indigo-200" : ""}
                  ${!isCompleted && !isActive ? "bg-sky-100 text-indigo-300 border border-indigo-200" : ""}
                `}
              >
                {isCompleted ? "✓" : step}
              </div>
              <span
                className={`text-xs mt-1 font-medium transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-indigo-300"}`}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {step < TOTAL_STEPS && (
              <div
                className={`w-8 h-0.5 mb-5 mx-1 transition-colors duration-300 ${isCompleted ? "bg-indigo-400" : "bg-indigo-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FormShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-indigo-800 mb-2 text-center">
          Patient Registration
        </h1>
        <p className="text-sm text-indigo-400 text-center mb-6">
          Complete all steps to register a new patient
        </p>
        <StepBar />
        {children}
      </div>
    </div>
  );
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormContextProvider>
      <FormShell>{children}</FormShell>
    </FormContextProvider>
  );
}

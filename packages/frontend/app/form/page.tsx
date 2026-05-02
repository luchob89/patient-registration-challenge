"use client";

import { useFormContext } from "./context/FormContext";
import StepName from "./steps/StepName";
import StepEmail from "./steps/StepEmail";
import StepPhone from "./steps/StepPhone";
import StepPhoto from "./steps/StepPhoto";

const STEPS = [StepName, StepEmail, StepPhone, StepPhoto];

export default function FormPage() {
  const { currentStep } = useFormContext();
  const StepComponent = STEPS[currentStep - 1];

  return <StepComponent />;
}

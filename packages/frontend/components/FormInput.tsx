"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  submitCount?: number;
}

export default function FormInput({
  hasError,
  submitCount,
  className,
  ...props
}: FormInputProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (hasError && submitCount && submitCount > 0) {
      controls.start({
        boxShadow: [
          "0 0 0 3px rgba(239,68,68,0.6)",
          "0 0 0 2px rgba(239,68,68,0.25)",
          "0 0 0 0px rgba(239,68,68,0)",
        ],
        transition: { duration: 2, ease: "easeOut" },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount]);

  return (
    <motion.input
      animate={controls}
      className={className}
      {...(props as React.ComponentProps<typeof motion.input>)}
    />
  );
}

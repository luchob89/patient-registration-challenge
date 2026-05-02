"use client";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";

interface ButtonProps {
  value: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  value,
  onPress,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: ButtonProps) {
  const base =
    "px-6 py-2 rounded-lg font-semibold cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-indigo-400 text-white hover:bg-indigo-500 focus:ring-indigo-400",
    secondary:
      "bg-sky-50/80 text-indigo-700 border border-indigo-200 hover:bg-sky-100 focus:ring-indigo-200",
    tertiary:
      "bg-sky-200/70 text-indigo-800 border border-sky-300 hover:bg-sky-300/70 focus:ring-sky-300",
    danger:
      "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-red-300",
  };

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {value}
    </button>
  );
}

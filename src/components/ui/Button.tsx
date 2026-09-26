import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  href,
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 font-bold transition";

  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger:
      "bg-red-50 text-red-600 hover:bg-red-100",
  };

  const className = `${base} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className}>
      {children}
    </button>
  );
}
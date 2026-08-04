import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-red text-white hover:bg-red/90",
  secondary:
    "bg-transparent text-navy border-2 border-navy hover:bg-navy hover:text-white",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

type LinkButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  href: string;
};

type NativeButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  href?: undefined;
};

type ButtonProps = LinkButtonProps | NativeButtonProps;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (props.href) {
    return <Link {...(props as LinkButtonProps)} className={classes} />;
  }

  return <button {...(props as NativeButtonProps)} className={classes} />;
}

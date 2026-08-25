import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

const variantClasses: Record<ButtonVariant, string> = {
  // One action colour, which is the rule 2a is built on: red owns every button,
  // in the nav and in the hero both. An earlier pass gave the hero its own teal
  // variant to avoid two red pills stacked near each other; 2a resolves that the
  // other way — the teal stops being an action colour at all and stays
  // structural, and the repetition becomes the point rather than a clash.
  //
  // The tinted drop shadow is what separates the pill from cream without an
  // outline. It is sized for the nav; the hero's larger pill scales it up.
  primary: "bg-red text-white shadow-[0_6px_16px_rgba(232,2,3,0.28)] hover:bg-red/90",
  secondary:
    "bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-white",
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

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

type ButtonProps =
  | (Without<NativeButtonProps, LinkButtonProps> & LinkButtonProps)
  | (Without<LinkButtonProps, NativeButtonProps> & NativeButtonProps);

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (props.href) {
    return <Link {...(props as LinkButtonProps)} className={classes} />;
  }

  return <button {...(props as NativeButtonProps)} className={classes} />;
}

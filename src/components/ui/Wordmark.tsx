import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tone = "navy",
}: {
  className?: string;
  tone?: "navy" | "white";
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-script text-4xl",
          tone === "navy" ? "text-navy" : "text-white"
        )}
      >
        Sazón
      </span>
      <span
        className={cn(
          "mt-1 font-heading text-[0.6rem] font-bold uppercase tracking-[0.25em]",
          tone === "navy" ? "text-navy/80" : "text-white/80"
        )}
      >
        Venezuelan Street Food
      </span>
    </span>
  );
}

import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "white";
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-script text-4xl",
          tone === "ink" ? "text-ink" : "text-white"
        )}
      >
        Sazón
      </span>
      <span
        className={cn(
          "mt-1 font-heading text-[0.6rem] font-bold uppercase tracking-[0.25em]",
          // The ink variant sits on cream (the header) and can afford /70; the
          // white variant sits on `celeste` (the footer) at 0.6rem, where /80
          // already drops under AA, so it stays at /90.
          tone === "ink" ? "text-ink/70" : "text-white/90"
        )}
      >
        Venezuelan Street Food
      </span>
    </span>
  );
}

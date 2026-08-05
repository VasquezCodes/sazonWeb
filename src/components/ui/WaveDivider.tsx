import { cn } from "@/lib/utils";

export function WaveDivider({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn(className, flip && "rotate-180")}
    >
      <path
        d="M0,64 C300,120 600,0 900,48 C1050,72 1150,40 1200,24 L1200,120 L0,120 Z"
        fill="#f0b429"
      />
      <path
        d="M0,80 C300,32 600,112 900,72 C1050,52 1150,88 1200,64 L1200,120 L0,120 Z"
        fill="#1c3f6e"
        opacity="0.9"
      />
      <path
        d="M0,100 C300,84 600,116 900,96 C1050,86 1150,108 1200,92 L1200,120 L0,120 Z"
        fill="#d6432b"
      />
    </svg>
  );
}

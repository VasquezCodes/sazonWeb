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
      // Mirrored on X only. `rotate-180` mirrors on both axes, which turns the
      // colour order upside down — red on top, gold last — and puts the filled
      // half at the top of the box, so the footer's copy floated with a strip of
      // the previous section's cream showing between it and the footer. Flipping
      // horizontally gives the same "not the hero's silhouette again" without
      // touching the stacking order.
      className={cn(className, flip && "-scale-x-100")}
    >
      {/* SVG `fill` can't read the Tailwind theme tokens, so these carry the
          literal values of `gold`, `red` and `celeste` from globals.css and have
          to be updated alongside them.

          The flag's order, top to bottom: gold, then celeste, then red. What it
          is not is three equal bands — red at gold's weight is what made an
          earlier version read as a busy stripe, two warm bands of the same size
          fighting over a cream ground. So the lower two are threads: 10 viewBox
          units of celeste and 8 of red, ~4px and ~3.2px at the h-12 this renders
          at.

          Red is a closed ribbon rather than a filled half like the two above it,
          and that is what lets the order hold. The colour under the wave has to
          be the same celeste as the section on the far side of this divider —
          that is the whole point in 2a, the wave resolves into the next section
          instead of cutting off against it — so red cannot be the fill at the
          bottom. Running it as a ribbon inside the celeste puts it below the
          blue, in flag order, with the water closing under it.

          Both threads trace the celeste curve, offset down from it, so each
          holds its thickness the whole way across and reads as a line following
          the water rather than another wave crossing it. */}
      <path
        d="M0,64 C300,120 600,0 900,48 C1050,72 1150,40 1200,24 L1200,120 L0,120 Z"
        fill="#e2a04a"
      />
      <path
        d="M0,80 C300,32 600,112 900,72 C1050,52 1150,88 1200,64 L1200,120 L0,120 Z"
        fill="#125f6c"
      />
      {/* Top edge is the celeste curve +10, bottom edge the same curve +18,
          walked back right-to-left with its control points swapped. */}
      <path
        d="M0,90 C300,42 600,122 900,82 C1050,62 1150,98 1200,74 L1200,82 C1150,106 1050,70 900,90 C600,130 300,50 0,98 Z"
        fill="#c03d27"
      />
    </svg>
  );
}

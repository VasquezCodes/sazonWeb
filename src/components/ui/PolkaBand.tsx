import { forwardRef } from "react";

export const PolkaBand = forwardRef<HTMLDivElement, { className?: string }>(
  function PolkaBand({ className }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        // Gold, where this was red. Its only consumer is the footer, and the
        // footer's ground is now `celeste`: red against celeste is 1.09:1, so a
        // red band there is invisible and stops working as a divider. Gold
        // reaches 2.79:1 and keeps the motif warm.
        className={`bg-gold bg-[radial-gradient(circle,_#ffffff_2px,_transparent_2.5px)] bg-[length:16px_16px] ${
          className ?? ""
        }`}
      />
    );
  }
);

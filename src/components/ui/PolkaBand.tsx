import { forwardRef } from "react";

export const PolkaBand = forwardRef<HTMLDivElement, { className?: string }>(
  function PolkaBand({ className }, ref) {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={`bg-red bg-[radial-gradient(circle,_#ffffff_2px,_transparent_2.5px)] bg-[length:16px_16px] ${
          className ?? ""
        }`}
      />
    );
  }
);

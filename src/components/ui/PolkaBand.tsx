export function PolkaBand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-red bg-[radial-gradient(circle,_#ffffff_2px,_transparent_2.5px)] bg-[length:16px_16px] ${
        className ?? ""
      }`}
    />
  );
}

import { cn } from "@/lib/utils";
import type { MenuBadge } from "@/types/menu";

const badgeConfig: Record<MenuBadge, { label: string; className: string }> = {
  spicy: { label: "🌶 Spicy", className: "bg-red text-white" },
  vegetarian: { label: "Vegetarian", className: "bg-navy text-white" },
  new: { label: "New", className: "bg-gold text-navy" },
};

export function Badge({ type }: { type: MenuBadge }) {
  const { label, className } = badgeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide",
        className
      )}
    >
      {label}
    </span>
  );
}

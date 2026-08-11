import { Flame, Sprout, Sparkles, WheatOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuBadge } from "@/types/menu";

// Filled pills describe the dish. "Gluten free" is an allergen claim, not a
// description, so it is outlined instead: someone scanning for it needs to
// pick it out from the promotional pills at a glance, not read all of them.
//
// Sparkles on "New" is the wordmark's own destello, the little burst drawn
// over the o in Sazon, rather than a generic decoration.
const badgeConfig: Record<
  MenuBadge,
  { label: string; icon: LucideIcon; className: string }
> = {
  spicy: { label: "Spicy", icon: Flame, className: "bg-red text-white" },
  vegetarian: { label: "Vegetarian", icon: Sprout, className: "bg-ink text-white" },
  new: { label: "New", icon: Sparkles, className: "bg-gold text-ink" },
  "gluten-free": {
    label: "Gluten free",
    icon: WheatOff,
    className: "border border-ink/40 text-ink",
  },
};

export function Badge({ type }: { type: MenuBadge }) {
  const { label, icon: Icon, className } = badgeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide",
        className
      )}
    >
      {/* 15px rather than matching the 12px label: WheatOff is the busiest
          glyph here (a stalk plus a slash) and it turns to mud any smaller,
          which defeats the point of flagging an allergen. The lighter stroke
          keeps that extra size from shouting over the text. */}
      <Icon size={15} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      {label}
    </span>
  );
}

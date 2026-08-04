export type MenuBadge = "spicy" | "vegetarian" | "new";

export interface MenuItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  badges: MenuBadge[];
}

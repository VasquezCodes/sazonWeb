export type MenuBadge = "spicy" | "vegetarian" | "new" | "gluten-free";

export interface MenuItem {
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Describes the photo itself. The dish name is already rendered next to
   *  the image, so repeating it as alt text tells a screen reader nothing. */
  imageAlt: string;
  badges: MenuBadge[];
}

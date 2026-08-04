import type { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  {
    slug: "filled-arepa",
    name: "Filled Arepa",
    description:
      "A toasted corn pocket packed with slow-cooked shredded beef, melted cheese and crunchy slaw.",
    image: "/images/4.jpeg",
    badges: ["new"],
  },
  {
    slug: "tequenos",
    name: "Tequeños",
    description:
      "Golden fried breadsticks wrapped around melting white cheese — the street food classic.",
    image: "/images/6.jpeg",
    badges: ["vegetarian"],
  },
  {
    slug: "empanadas",
    name: "Empanadas",
    description:
      "Crisp corn empanadas stuffed to order, served with our house avocado-herb dip.",
    image: "/images/3.jpeg",
    badges: ["spicy"],
  },
  {
    slug: "sazon-bowl",
    name: "Sazón Bowl",
    description:
      "Shredded beef, black beans, guacamole, pico de gallo and fried plantain over an arepa base.",
    image: "/images/1.jpeg",
    badges: [],
  },
];

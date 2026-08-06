import type { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  {
    slug: "filled-arepa",
    name: "Filled Arepa",
    description:
      "Grilled corn pockets filled to order: slow-cooked shredded beef with melting cheese, or chicken with avocado.",
    image: "/images/menu-arepas.webp",
    imageAlt:
      "Plate of grilled arepas, some split and filled with shredded beef, cheese and chicken",
    badges: ["new", "gluten-free"],
  },
  {
    slug: "tequenos",
    name: "Tequeños",
    description:
      "Golden fried breadsticks wrapped around melting white cheese, served with our avocado-herb dip.",
    image: "/images/menu-tequenos.webp",
    imageAlt:
      "Plate of fried tequeños with cheese pulling from one, beside a pot of green dip",
    badges: ["vegetarian"],
  },
  {
    slug: "empanadas",
    name: "Empanadas",
    description:
      "Crisp corn empanadas stuffed to order, served with our house avocado-herb dip.",
    image: "/images/menu-empanadas.webp",
    imageAlt:
      "Plate of corn empanadas, one broken open to show shredded beef, beside a pot of green dip",
    badges: ["spicy"],
  },
  {
    slug: "sazon-bowl",
    name: "Sazón Bowl",
    description:
      "Shredded beef, black beans, guacamole, pico de gallo and fried plantain over an arepa base.",
    image: "/images/menu-bowls.webp",
    imageAlt:
      "Bowl of shredded beef, black beans, guacamole, pico de gallo and fried plantain with an arepa wedge",
    badges: ["gluten-free"],
  },
];

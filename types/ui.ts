export enum BadgeColor {
  BLUE = "blue",
  GREEN = "green",
  ORANGE = "orange",
  PURPLE = "purple",
  BLACK = "black",
}

export const HEX_COLOR_MAP: Record<string, BadgeColor> = {
  "#6CCEFF": BadgeColor.BLUE,
  "#88FF47": BadgeColor.GREEN,
  "#B8FF47": BadgeColor.GREEN,
  "#FF5900": BadgeColor.ORANGE,
  "#5500FF": BadgeColor.PURPLE,
  "#000000": BadgeColor.BLACK,
};

export type TypographyItem = {
  label: string;
  class: string;
};

export type ColorItem = {
  name: string;
  label: string;
  hex: string;
};

import { BadgeColor, HEX_COLOR_MAP } from "~/types/ui";

export const hexToBadgeColor = (hex: string): BadgeColor => {
  return HEX_COLOR_MAP[hex] || BadgeColor.BLUE;
};

import { ref } from "vue";
import { BadgeColor } from "~/types/ui";

type StateType = "default" | "checked" | "hover";
type TextFieldStateType = "default" | "active" | "hover";

export const badges = [
  { color: BadgeColor.BLUE, label: "Blue", text: "Personal" },
  { color: BadgeColor.GREEN, label: "Green", text: "Career" },
  { color: BadgeColor.ORANGE, label: "Orange", text: "Workout" },
  { color: BadgeColor.PURPLE, label: "Purple", text: "Travel" },
  { color: BadgeColor.BLACK, label: "Black", text: "3" },
];

export const colors = [
  { name: "black", label: "Black", hex: "#000000" },
  { name: "light-gray-1", label: "Light Gray 1", hex: "#F5F5F5" },
  { name: "light-gray-2", label: "Light Gray 2", hex: "#EEEEEE" },
  { name: "gray-1", label: "Gray 1", hex: "#DDDDDD" },
  { name: "gray-2", label: "Gray 2", hex: "#AAAAAA" },
  { name: "dark-gray", label: "Dark Gray", hex: "#4F4F4F" },
  { name: "white", label: "White", hex: "#FFFFFF" },
  { name: "red", label: "Red", hex: "#FF1500" },
  { name: "blue", label: "Blue", hex: "#6CCEFF" },
  { name: "green", label: "Green", hex: "#88FF47" },
  { name: "orange", label: "Orange", hex: "#FF5900" },
  { name: "purple", label: "Purple", hex: "#5500FF" },
] as const;

export const states: Array<{ state: StateType; label: string }> = [
  { state: "default", label: "Default" },
  { state: "checked", label: "Checked" },
  { state: "hover", label: "Hover" },
];

export const textFieldStates: Array<{
  state: TextFieldStateType;
  label: string;
}> = [
  { state: "default", label: "Default" },
  { state: "active", label: "Active" },
  { state: "hover", label: "Hover" },
];

export const typographyItems = [
  {
    label: "UI Heading",
    class: "heading-uikit",
  },
  {
    label: "Heading 1",
    class: "heading-1",
  },
  {
    label: "Heading 2",
    class: "heading-2",
  },

  {
    label: "Text 1",
    class: "text-1",
  },
  {
    label: "Text 2",
    class: "text-2",
  },
  {
    label: "Text 3",
    class: "text-3",
  },
  {
    label: "Label",
    class: "label",
  },
];

export const checkboxValues = ref<Record<StateType, boolean>>({
  default: false,
  checked: true,
  hover: false,
});

export const radioValues = ref<Record<StateType, boolean>>({
  default: false,
  checked: true,
  hover: false,
});

export const textFieldValues = ref<Record<TextFieldStateType, string>>({
  default: "",
  active: "Active State",
  hover: "",
});

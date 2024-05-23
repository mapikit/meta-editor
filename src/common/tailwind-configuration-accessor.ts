import resolveConfig from "tailwindcss/resolveConfig";
import twConfig from "../data/tailwind-config";

const tailwindData = resolveConfig(twConfig);

export const getTailwindColor = (name : string, intensity ?: string | number) : string => {
  const result = tailwindData.theme.colors[name];

  if (intensity) {
    return result[intensity];
  }

  return result as string;
};

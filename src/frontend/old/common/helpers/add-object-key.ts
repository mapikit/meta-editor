import clone from "just-clone";

export const addObjectKey = <T>(object : Record<string, T>, key : string, value : T)
: Record<string, T> => {
  const result = clone(object);
  result[key] = value;

  return result;
};

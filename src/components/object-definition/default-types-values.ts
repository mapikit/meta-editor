export const defaultTypesValues = {
  "string": "",
  "number": 0,
  "boolean": false,
  "enum": "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  "function": () => {},
  "date": new Date(),
  "object": {},
  "cloudedObject": {},
  "any": "",
  "array": [],
};

export const defaultSubTypesValues = {
  "string": undefined,
  "number": undefined,
  "boolean": undefined,
  "enum": [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  "function": undefined,
  "date": undefined,
  "object": [],
  "cloudedObject": [],
  "any": undefined,
  "array": "string",
};

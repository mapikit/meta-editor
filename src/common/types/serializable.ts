type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [key : string] : JSONValue;
}
interface JSONArray extends Array<JSONValue> {}

/** Omits unparseable data from JSON */
export type Serializable<T> = Pick<T,{
  [K in keyof T] : T[K] extends JSONValue ? K : never;
}[keyof T]>;

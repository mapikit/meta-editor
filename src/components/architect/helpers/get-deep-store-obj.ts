import { get, readable, Readable } from "svelte/store";

export function getDeepStoreObject <T> (input : T | Readable<T>) : T {
  let temp : T = input as T;
  if(isSvelteReadable(temp)) temp = get(input as Readable<T>);

  if(Array.isArray(temp)) return temp.map(value => getDeepStoreObject(value)) as unknown as T;

  if(typeof temp === "object") {
    const aux : T = {} as T;
    for(const key of Object.keys(temp)) {
      aux[key] = getDeepStoreObject(temp[key]);
    }
    return aux;
  }

  return temp;
}


function isSvelteReadable (input : unknown | Readable<unknown>) : boolean {
  console.log(input);
  console.log("isReadable instance:", input instanceof readable);
  return typeof input === "object" &&
         "subscribe" in input &&
         typeof input["subscribe"] === "function";
}

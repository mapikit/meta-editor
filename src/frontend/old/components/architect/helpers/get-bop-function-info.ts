import { get } from "svelte/store";
import type { StoreModuleInfo } from "../../../common/types/store-module-info";
import type { UIBusinessOperation } from "../../../entities/business-operation";


export function getAllBopsInfo (bops : UIBusinessOperation[]) : Map<string, StoreModuleInfo> {
  const infos : Map<string, StoreModuleInfo> = new Map();


  for(const bop of bops) {
    //Check for loops and other problems involving current bop
    infos.set(get(bop.id), getBopFunctionInfo(bop));
  }
  return infos;
}


export function getBopFunctionInfo (bop : UIBusinessOperation) : StoreModuleInfo {
  if(bop === undefined) return undefined;
  return {
    functionName: get(bop.name),
    input: get(bop.input.storedDefinition).output,
    output: get(bop.output.storedDefinition).input,
    bopId: get(bop.id),
  };
}

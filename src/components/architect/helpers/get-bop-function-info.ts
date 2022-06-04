import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import { get } from "svelte/store";
import type { UIBusinessOperation } from "../../../entities/business-operation";


type BopFunctionInfo = FunctionDefinition & { description : string; bopId : string }

export function getAllBopsInfo (bops : UIBusinessOperation[]) : Map<string, BopFunctionInfo> {
  const infos : Map<string, BopFunctionInfo> = new Map();


  for(const bop of bops) {
    //Check for loops and other problems involving current bop
    infos.set(get(bop.id), getBopFunctionInfo(bop));
  }
  return infos;
}


export function getBopFunctionInfo (bop : UIBusinessOperation) : BopFunctionInfo {
  if(bop === undefined) return undefined;
  return {
    functionName: get(bop.name),
    input: get(bop.input).definition,
    output: get(bop.output),
    description: get(bop.description),
    bopId: get(bop.id),
  };
}

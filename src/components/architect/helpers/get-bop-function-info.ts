import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import { get } from "svelte/store";
import type { UIBusinessOperation } from "../../../entities/business-operation";


// export function getAllPossibleInfo (bops : BusinessOperations[], currentBop : string) : FunctionDefinition[] {
//   const infos : FunctionDefinition[] = [];
//   for(const bop of bops) {
//     if(bop.name === currentBop) continue;
//     //Check for loops and other problems involving current bop
//     infos.push(getBopFunctionInfo(bop));
//   }
//   return infos;
// }


export function getBopFunctionInfo (bop : UIBusinessOperation) : FunctionDefinition {
  return {
    functionName: get(bop.name),
    input: get(bop.input).definition,
    output: get(bop.output),
  };
}

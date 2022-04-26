import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import type { BusinessOperations } from "meta-system/dist/src/configuration/business-operations/business-operations-type";


export function getAllPossibleInfo (bops : BusinessOperations[], currentBop : string) : FunctionDefinition[] {
  const infos : FunctionDefinition[] = [];
  for(const bop of bops) {
    if(bop.name === currentBop) continue;
    //Check for loops and other problems involving current bop
    infos.push(getBopFunctionInfo(bop));
  }
  return infos;
}


export function getBopFunctionInfo (bop : BusinessOperations) : FunctionDefinition {
  return {
    functionName: bop.name,
    input: bop.input,
    output: bop.output,
  };
}

import type { FunctionDefinition, MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
import { mapikitServer } from "../../../../common/network";

export async function getExternalModules () : Promise<Record<string, FunctionDefinition[]>> {
  const infos = (await mapikitServer.get("getConfigs")).data.functionsInfo
  const packageModules : Record<string, FunctionDefinition[]> = {}
  packageModules["Not In a Package"] = [];
  for(const info of infos) {
    if(info["functionsDefinitions"] !== undefined) {
      const mPackage = info as MetaPackage;
      packageModules[mPackage.name] = mPackage.functionsDefinitions as FunctionDefinition[];
    } else {
      //NOTE This is a terrible way to do this, conflict, change.
      const mFunction = info as MetaFunction;
      packageModules["Not In a Package"].push(mFunction);
    }
  }
  return packageModules;
}
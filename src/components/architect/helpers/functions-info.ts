/* eslint-disable max-lines-per-function */
import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import msys from "meta-system";
import type { SchemasFunctions } from "meta-system/dist/src/schemas/domain/schemas-functions";
import { countInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/count";
import { deleteInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete";
import { deleteByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete-by-id";
import { getInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find";
import { getByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find-by-id";
import { createInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/insert";
import { updateInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update";
import { updateByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update-by-id";
import { getBopFunctionInfo } from "./get-bop-function-info";
import { businessOperations, schemas } from "../../../stores/configuration-store";
import { get } from "svelte/store";
import clone from "just-clone";
import type { ModuleCard } from "../../../common/types/module-card";


const internalManager = msys.internalFunctionManagerSingleton;
// TODO !IMPORTANT There seems to be some inconsistency in this part between dev and build,
// possibly related to the way msys exports its components.

export class FunctionsInfo {
  private static getSchemaFunctionInfo (schemaName : string, functionName : string) : FunctionDefinition {
    if(schemaName === undefined) return undefined;
    const functionInfo : FunctionDefinition = clone(this.schemaDefaultInfo[functionName]);
    const schema = get(schemas).find(_schema => get(_schema.name) === schemaName);
    for(const input in functionInfo.input) {
      if(functionInfo.input[input].type === "%entity") {
        functionInfo.input[input]["subtype"] = get(schema.format);
        functionInfo.input[input].type = "object";
      }
    }

    for(const output in functionInfo.output) {
      if(functionInfo.output[output].type === "%entity") {
        functionInfo.output[output]["subtype"] = get(schema.format);
        functionInfo.output[output].type = "object";
      }
    }
    return functionInfo;
  }

  public static getCardInfo (moduleConfig : ModuleCard) : FunctionDefinition {
    console.log("Generating data for module Config", moduleConfig);
    switch (moduleConfig.moduleType) {
      case "bop": {
        const bop = get(businessOperations).find(_bop => get(_bop.id) === moduleConfig.bopId);
        return getBopFunctionInfo(bop);
      }
      case "schemaFunction":
        return FunctionsInfo.getSchemaFunctionInfo(moduleConfig.modulePackage, moduleConfig.moduleName);
      case "internal":
        return internalManager.infoMap.get(moduleConfig.moduleName);
      default:
        return undefined;
    }
  }

  public static get getInternalsInfo () : FunctionDefinition[] {
    return Array.from(internalManager.infoMap.values());
  }

  public static getSchemasInfo (schemaName : string) : FunctionDefinition[] {
    return Object.keys(this.schemaDefaultInfo).map(schemaFunc => this.getSchemaFunctionInfo(schemaName, schemaFunc));
  }

  private static schemaDefaultInfo : Record<keyof typeof SchemasFunctions, FunctionDefinition> = {
    count: countInfo,
    delete: deleteInfo,
    deleteById: deleteByIdInfo,
    find: getInfo,
    findById: getByIdInfo,
    insert: createInfo,
    update: updateInfo,
    updateById: updateByIdInfo,
  };
}





import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import msys from "meta-system";
import type { ModuleType } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { SchemasFunctions } from "meta-system/dist/src/schemas/domain/schemas-functions";
import { countInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/count";
import { deleteInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete";
import { deleteByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/delete-by-id";
import { getInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find";
import { getByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/find-by-id";
import { createInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/insert";
import { updateInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update";
import { updateByIdInfo } from "meta-system/dist/src/schemas/application/schema-functions-info/update-by-id";


const internalManager = msys.internalFunctionManagerSingleton;

// TODO !IMPORTANT There seems to be some inconsistency in this part between dev and build,
// possibly related to the way msys exports its components.

export const functionsInfo : Record<ModuleType, Map<string, FunctionDefinition>> = {
  schemaFunction: new Map<keyof typeof SchemasFunctions, FunctionDefinition>([
    ["count", countInfo],
    ["delete", deleteInfo],
    ["deleteById", deleteByIdInfo],
    ["find", getInfo],
    ["findById", getByIdInfo],
    ["insert", createInfo],
    ["update", updateInfo],
    ["updateById", updateByIdInfo],
  ]),
  external: undefined,
  internal: internalManager.infoMap,
  bop: undefined,
  output: undefined,
  variable: undefined,
  protocol: undefined,
};


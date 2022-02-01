import type { FunctionDefinition } from "@meta-system/meta-function-helper";


import msys from "meta-system";

const internalManager = msys.internalFunctionManagerSingleton;

// TODO !IMPORTANT There seems to be some inconsistency in this part between dev and build,
// possibly related to the way msys exports its components.

export const functionsInfo = new Map<string, FunctionDefinition>()
internalManager.infoMap.forEach((value, key) => functionsInfo.set(`internal.${key}`, value));


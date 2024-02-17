import type { Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";

export function getConnectionIdentifier (dependency : Dependency, originKey : number) : string {
  return `${dependency.originPath.split(".").slice(1).join(".")}@${dependency.origin}-`+
         `${dependency.targetPath}@${originKey}`;
}

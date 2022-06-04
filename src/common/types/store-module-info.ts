import type { FunctionDefinition } from "@meta-system/meta-function-helper";

export interface StoreModuleInfo extends FunctionDefinition {
  schemaName ?: string;
  bopId ?: string;
}

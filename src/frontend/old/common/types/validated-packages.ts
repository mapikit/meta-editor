import type { MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";

export type MetaFileTypes = "protocol" | "package" | "function";

export type ValidatedPackage<Type extends MetaFunction | MetaPackage | MetaProtocolDefinition> = {
  _id : string;
  name : string;
  version : string;
  type : MetaFileTypes | "dbProtocol";
  description : string;
  packageConfiguration : Type;
  validatedAt : Date;
}

import type { MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";
import type { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import type { MetaFileTypes } from "../../common/types/validated-packages";

export type SpecificPackageInfo<Type extends MetaFileTypes = any> = {
  type : MetaFileTypes,
  name : string,
  version : string
  author : string,
  description : string,
  configuration ?: PackageInfo<Type>
}

export type PackageInfo<TypeName extends MetaFileTypes> =
  TypeName extends "package" ? MetaPackage :
    TypeName extends "function" ? MetaFunction & { functionName : string } :
      TypeName extends "protocol" ? MetaProtocolDefinition & { kind : ProtocolKind, id : string} : never;

export type PackageListInfo<Type extends MetaFileTypes = any> = {
  header : {
    name : string;
    versions : string[];
    author : string;
    description : string;
  }
  fullPackages : Array<SpecificPackageInfo<Type>>
}

import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import type { BopsConfigurationEntry, Dependency } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import type { Coordinate } from "./geometry";

export type UICompliantDependency = Dependency & {
  originNob : HTMLSpanElement;
  targetNob : HTMLSpanElement;
  matchingType : boolean;
}

export interface ModuleCard extends BopsConfigurationEntry {
  position ?: Coordinate;
  info ?: FunctionDefinition;
  dependencies : Array<UICompliantDependency>
}

const bar = {
  a: "aaaaa",
};

const foo = {
  b: "bbbb",
};

foo.b = bar.a;
bar.a = "asd";

console.log(foo.b); //asd

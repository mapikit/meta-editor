import type { BusinessOperation } from "./business-operation";
import type { Schema } from "./schema";
import type { Protocol } from "./protocol";
import type { EnvironmentVariable } from "./environment-variable";

export class Configuration {
  public readonly businessOperations : BusinessOperation[] = [];
  public readonly schemas : Schema[] = [];
  public readonly protocols : Protocol[] = [];
  public readonly envs : EnvironmentVariable[] = [];

  public constructor (
    public readonly id : string,
    public name : string,
    public readonly version : string,
  ) {}
}
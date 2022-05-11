import type { Configuration } from "./configuration";

export class Project {
  constructor (
    public readonly id : string,
    public name : string,
    public description: string,
    public configuration : Array<Configuration> = [],
  ) {}
}
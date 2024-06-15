import { ObjectDefinition } from "@meta-system/object-definition";
import { BopsConstant, BopsVariable, BopsConfigurationEntry }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { Writable, get, writable } from "svelte/store";
import { BusinessOperation } from "../models/business-opration";
import { StoreEntityModel } from "../models/store-model";

export class BusinessOperationStore implements StoreEntityModel<BusinessOperation> {
  public readonly identifier : string;
  public readonly ttl ?: Writable<number> = writable();
  public readonly input : Writable<ObjectDefinition> = writable({});
  public readonly output : Writable<ObjectDefinition> = writable({});
  public readonly constants : Writable<BopsConstant[]> = writable([]);
  public readonly variables : Writable<BopsVariable[]> = writable([]);
  public readonly configuration : Writable<BopsConfigurationEntry[]> = writable([]);

  public constructor (parameter : BusinessOperation) {
    this.identifier = parameter.identifier;
    this.ttl.set(parameter.ttl);
    this.input.set(parameter.input);
    this.output.set(parameter.output);
    this.constants.set(parameter.constants);
    this.variables.set(parameter.variables);
    this.configuration.set(parameter.configuration);
  }

  public toEntity () : BusinessOperation {
    return new BusinessOperation({
      identifier: this.identifier,
      ttl: get(this.ttl),
      input: get(this.input),
      output: get(this.output),
      constants: get(this.constants),
      variables: get(this.variables),
      configuration: get(this.configuration),
    });
  }
}

import type { Schema } from "../entities/schema";
import { derived, get, Writable, writable } from "svelte/store";
import type { Configuration } from "../entities/configuration";
import type { UIBusinessOperation } from "../entities/business-operation";
import type { Protocol } from "../entities/protocol";
import type { EnvironmentVariable } from "../entities/environment-variable";

export const availableConfigurations : Writable<Configuration[]> = writable([]);

// From this and below, it should actually be the data of the currently selected configuration.
// If no configuration is selected, this should be empty.
export const schemas : Writable<Schema[]> = writable([]);
export const businessOperations : Writable<UIBusinessOperation[]> = writable([]);
export const protocols : Writable<Protocol[]> = writable([]);
export const environmentVariables : Writable<EnvironmentVariable[]> = writable([]);

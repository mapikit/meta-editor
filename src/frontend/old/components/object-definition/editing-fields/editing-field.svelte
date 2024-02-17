<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { AvailableEditingTypes } from "./available-types";
  import BooleanField from "./boolean-field.svelte";
  import DateField from "./date-field.svelte";
  import EnumField from "./enum-field.svelte";
  import NumberField from "./number-field.svelte";
  import StringField from "./string-field.svelte";

  export let editingType : TypeDefinition["type"] = "string";
  export let propValue : unknown = "";
  export let updateFunction = () => {};
  export let subtype : any;
  let componentSelector = {};

  componentSelector[AvailableEditingTypes.string] = StringField;
  componentSelector[AvailableEditingTypes.number] = NumberField;
  componentSelector[AvailableEditingTypes.boolean] = BooleanField;
  componentSelector[AvailableEditingTypes.date] = DateField;
  componentSelector[AvailableEditingTypes.enum] = EnumField;

  let selectedComponent;

  $: selectedComponent = componentSelector[editingType];
</script>

{#if selectedComponent !== undefined}
  <svelte:component this={selectedComponent} bind:propValue={propValue} updateFunction={updateFunction} bind:subtype={subtype}
  />
{/if}

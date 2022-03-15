<script lang="ts">
  import type { TypeDefinition } from "@meta-system/object-definition";
  import { AvailableEditingTypes } from "./available-types";
  import NumberField from "./number-field.svelte";
  import StringField from "./string-field.svelte";

  export let editingType : TypeDefinition["type"] = "string";
  export let propValue : unknown = "";
  export let updateFunction = () => {};
  let componentSelector = {};

  componentSelector[AvailableEditingTypes.string] = StringField;
  componentSelector[AvailableEditingTypes.number] = NumberField;

  let selectedComponent

  $: selectedComponent = componentSelector[editingType];
</script>

{#if selectedComponent !== undefined}
  <svelte:component this={selectedComponent} bind:propValue={propValue} updateFunction={updateFunction}/>
{:else}
  <p></p>
{/if}

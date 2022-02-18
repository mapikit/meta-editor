<script lang="ts">
import type { Writable } from "svelte/store";


  import { possibleConstTypes } from "./inputs-map";
  let value : string;
  let name : string;
  let ref : HTMLDivElement;
  export let parentReference : Writable<{}>;

  function handleChange (event : Event) {
    if(name === "" || name === undefined) {
      value = "";
      return window.alert("Please, set property name first");
    }
    if(parentReference[name] !== undefined)
      return window.alert("Property names must be unique")
    $parentReference[name] = { type: value, value: undefined }
  }

</script>
<div class="placeholder" bind:this={ref}>
  <input type="text" placeholder="Property Name" bind:value={name}/>
    <label for="types"></label>
    <select bind:value on:change={handleChange}>
      <option value="" disabled selected hidden>Set Type</option>
      {#each possibleConstTypes as type}
        <option value={type}>{type[0].toUpperCase()+type.slice(1)}</option>
      {/each}
    </select><br>
</div>
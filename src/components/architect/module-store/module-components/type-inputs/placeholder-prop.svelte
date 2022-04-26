<script lang="ts">
  import type { Writable } from "svelte/store";
  import Select from "../../../../select/type-select.svelte";


  let name : string;
  let type : string;

  export let parentReference : Writable<{}>;

  function handleChange (event : CustomEvent<{value : any}>) {
    if(name === "" || name === undefined) {
      type = undefined;
      return window.alert("Please, set property name first");
    }
    if(parentReference[name] !== undefined) {
      return window.alert("Property names must be unique");
    }
    $parentReference[name] = { type: event.detail.value, value: undefined };
  }

</script>
<div class="placeholder">
  <input type="text" placeholder="Property Name" bind:value={name}/>
  <Select on:change={handleChange} bind:value={type}/>
</div>
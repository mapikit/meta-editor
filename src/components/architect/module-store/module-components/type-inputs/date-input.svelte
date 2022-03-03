<script lang="ts">
  export let value : Date;

  $: value = new Date(stringDate)
  let stringDate : string
</script>

<input type="date" bind:value={stringDate}/>
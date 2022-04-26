<script lang="ts">
  const localeSeparator = (1.1).toLocaleString().slice(1,2);
  const allowedStrings : string[] = [localeSeparator];

  export let value : string;
  function handleInput (e : KeyboardEvent) {
    if(!Number.isNaN(Number(e.key))) return;
    if(allowedStrings.includes(e.key)) return;

    e.preventDefault();
  }

  // It would be insteresting to add a expression resolution in the future
  // (E.x.: "1+1" becomes 2, 3^2 becomes 9 and so on)
  // on:focusout={resolveValue}
  // function resolveValue () {
  //   value = math.eval(value);
  // }
</script>


<input type="number" bind:value on:keypress={handleInput}/>
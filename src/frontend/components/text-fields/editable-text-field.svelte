<script lang="ts">
  export let text : string;
  export let onFinishEdit : (value : string) => void = () : void => {};
  export let onChange : (value : string) => void = () : void => {};

  let previousText : string = text;
  let blockFlag = false;
  let clazz : string = "w-full";
  export { clazz as class };

  function handleKey (e : KeyboardEvent) : void {
    switch(e.key ?? e.code) {
      case "Escape":
        cancelEdition();
        break;
      case "Enter":
        confirmEdition();
        break;
    }
  }

  function cancelEdition () : void {
    blockFlag = true;
    field.blur();
    text = previousText;
  }

  function confirmEdition () : void {
    if(blockFlag) {
      blockFlag = false;
      return;
    }
    previousText = text;
    onFinishEdit(text);
    field.blur();
  }

  let field : HTMLInputElement;
</script>

<input type="text" class="bg-norbalt-400 rounded px-2
  text-offWhite focus:text-white focus:outline-1 focus:outline focus:outline-norbalt-100 transition {clazz}"
  size="0"
  on:keydown={handleKey}
  on:focusout={confirmEdition}
  on:input={(e) => onChange(e.currentTarget.value)}
  bind:this={field}
  bind:value={text}/>

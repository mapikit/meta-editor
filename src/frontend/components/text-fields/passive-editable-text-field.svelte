<script lang="ts">
    export let text : string;
    export let onFinishEdit = () : void => {};


    let previousText : string = text;
    let blockFlag = false;

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
      onFinishEdit();
    }

    let field : HTMLInputElement;

</script>

<span>
  <input type="text" class="inline-flex bg-norbalt-500 w-full rounded-md pl-2"
    on:keydown={handleKey}
    on:focusout={confirmEdition}
    bind:this={field}
    bind:value={text}/>
</span>

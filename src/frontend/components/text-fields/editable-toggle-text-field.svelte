<script lang="ts">
  import { Check, PencilSimple } from "phosphor-svelte";
  import { Writable, writable } from "svelte/store";

  export let text : Writable<string> = writable("");
  export let onSubmit = () : void => {};
  let clazz : string = "w-full";
  export { clazz as class };

  let inputElement : HTMLElement;

  let editing : Writable<boolean> = writable(false);
  let doneFlag = false;
  let previousText : string = $text;

  editing.subscribe(e => {
    if(e) {
      previousText = $text;
      doneFlag = true;
    } else if(doneFlag) {
      onSubmit();
      doneFlag = false;
    }
  });

  function handleKey (e : KeyboardEvent) : void {
    switch(e.key ?? e.code) {
      case "Escape":
        doneFlag = false;
        text.set(previousText);
        editing.set(false);
        inputElement.blur();
        break;
      case "Enter":
        doneFlag = true;
        editing.set(false);
        inputElement.blur();
        break;
    }
  }

</script>

<div class="flex items-center justify-between {clazz}">
  <input bind:value={$text} type="text"
    class="rounded px-2 py-1 -mt-1 -ml-2 flex-1 outline-none
    {$editing ? " bg-norbalt-400" : " bg-transparent"} w-fit"
      size="1"
    on:keydown={handleKey}
    on:focus={() => { editing.set(true); }}
    on:blur={() => { editing.set(false); }}
    bind:this={inputElement}/>
  <button class="{$editing ? "text-brightGreen" : "text-offWhite"} hover:text-white transition-colors
    p-1 inline-flex items-center ml-1 w-fit"
    on:click={() => {
      editing.set(!$editing);

      if ($editing) { inputElement.focus(); }
    }}
  >
  {#if $editing}
    <Check />
  {:else}
    <PencilSimple />
  {/if}
  </button>
</div>

<script lang="ts">
    import { Writable, writable } from "svelte/store";

    export let text : Writable<string> = writable("");
    export let editing : Writable<boolean> = writable(false);
    export let onSubmit = () : void => {};

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
          break;
        case "Enter":
          doneFlag = true;
          editing.set(false);
          break;
      }
    }

    function init (element : HTMLElement) : void { element.focus(); }
</script>

<div style="padding-left: {$editing ? "0pt" : "4pt"};">
    {#if $editing}
        <input bind:value={$text} type="text" class="inline-flex bg-norbalt-500 rounded-md pl-2" size="{$text.length}" on:keydown={handleKey} use:init/>
    {:else}
        {$text}
    {/if}
</div>

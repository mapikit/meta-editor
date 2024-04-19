<script lang="ts">
    export let text : string;
    export let onFinishEdit = () => {};


    let previousText : string = text;
    let blockFlag = false;

    function handleKey (e : KeyboardEvent) {
        switch(e.key ?? e.code) {
            case "Escape":
                cancelEdition()
                break;
            case "Enter":
                confirmEdition()
                break;
        }
    }

    function cancelEdition () {
        blockFlag = true;
        field.blur();
        text = previousText;
    }

    function confirmEdition () {
        if(blockFlag) return blockFlag = false;
        previousText = text;
        onFinishEdit();
    }

    let field : HTMLInputElement;

</script>

<span>
        <input bind:value={text} type="text" class="inline-flex bg-norbalt-500 w-full rounded-md pl-2" on:keydown={handleKey} on:focusout={confirmEdition} bind:this={field}/>
</span>

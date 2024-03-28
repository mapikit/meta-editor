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

<span class="outer">
        <input bind:value={text} type="text" class="field" on:keydown={handleKey} on:focusout={confirmEdition} bind:this={field}/>
</span>

<style lang="scss">
    .field {
        display: inline-flex;
        background-color: #151537;
        width: 100%;
        border-radius: 4pt;
        padding-left: 4pt;
    }

</style>
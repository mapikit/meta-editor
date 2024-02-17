<script lang="ts">
function createProject() : void {
    console.log("Should create a project")
}
</script>


<span aria-hidden="true" class="button" on:click={createProject}>
Create
</span>

<style lang="scss">
    .button {
        background-color: #21264a;
        border-radius: 4pt;
        padding: 6pt;
        font-size: 12pt;
        font-weight: 700;
        color: rgba(166, 168, 192, 0.54375);
        margin-left: 30pt;
        user-select: none;
    }

    .button:hover {
        background-color: rgba(166, 168, 192, 0.24375);
    }
</style>
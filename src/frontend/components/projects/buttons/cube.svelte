<span class="background">
<img aria-hidden="true" class="cube" src="src/frontend/components/projects/cube.svg" alt="package"/>
</span>
<style lang="scss">
    .cube {
        height: 25pt;
        filter: opacity(0.54375) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
    }

    .background {
        display: flex;
        background-color: #151537;
        border-radius: 8pt;
        width: 32pt;
        height: 32pt;
        align-items: center;
        justify-content: center;
    }

    .cube:hover { filter: invert(77%) sepia(55%) saturate(541%) hue-rotate(84deg) brightness(96%) contrast(100%); }

</style>
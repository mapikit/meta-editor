<span class="background">
<img aria-hidden="true" class="trash" src="src/frontend/components/projects/trash.svg" alt="trash"/>
</span>

<style lang="scss">
    .trash {
        height: 23pt;
        filter: opacity(0.54375) invert(81%) sepia(18%) saturate(284%) hue-rotate(198deg) brightness(83%) contrast(82%);        // stroke: red;
    }

    .trash:hover { filter: invert(55%) sepia(51%) saturate(5164%) hue-rotate(319deg) brightness(106%) contrast(95%); }

    .background {
        display: flex;
        background-color: #151537;
        border-radius: 8pt;
        width: 32pt;
        height: 32pt;
        align-items: center;
        justify-content: center;
    }
</style>
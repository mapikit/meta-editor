<script lang="ts">
  import type { BopsConfigurationEntry, BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { Writable } from "svelte/store";
  import { typeColors } from "../../../common/styles/type-colors";
  import { expand } from "../../../common/transitions/expand";
  import { spin } from "../../../common/transitions/spin";

  import DropdownIcon from "../module-store/dropdown-icon.svelte";

  export let config : BopsConstant;
  export let parentKey : number;
  export let fullPathName : string;
  export let bopModules : Writable<BopsConfigurationEntry[]>

  function removeTag () {
    bopModules.update(modules => {
      const parentCard = modules.find(module => module.key === parentKey)
      const index = parentCard.dependencies.findIndex(dependency => {
        return ["constant", "constants"].includes(dependency.origin as string) &&
          dependency.targetPath === fullPathName &&
          dependency.originPath === config.name;
      })
      parentCard.dependencies.splice(index, 1);
      return modules;
    })
  }

</script>

<div class="constantTag" transition:expand|global >
  <div class="removeIcon" on:click={removeTag} in:spin|global={{ initial: 45 }}><DropdownIcon/></div>
  <span class="name">{config.name}&nbsp;</span><span 
    class="indicator" style="color: {typeColors[config.type]};"> ●</span>
</div>

<style lang="scss">
  .constantTag {
    background-color: #1a1616;
    position: absolute;
    top: 0px;
    display: flex;
    right: calc(100% - 28px);
    width: max-content;
    padding-right: 16px;
    padding-bottom: 3px;
    padding-left: 7px;
    border-radius: 10px 0 0 10px;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  }

  .removeIcon {
    width: 12px;
    height: 12px;
    place-content: center;
    display: flex;
    margin-right: 7px;
    margin-top: 6px;
    stroke: white;
    transform-origin: center;
    transform: rotate(45deg);
  }

</style>
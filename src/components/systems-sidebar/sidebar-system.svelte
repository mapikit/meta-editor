<script lang="ts">
  import type { SystemData } from "./types";
  import { fade } from "svelte/transition";
  import { selectedSystem } from "./systems-stores";

  export let system : SystemData;
  let collapsed = true;

  selectedSystem.subscribe((value) => {
    collapsed = !(value === system.name); // TODO CHANGE TO BE AN UNIQUE ID
  })

  const updateCollapsedStatus = () => {
    if (collapsed === true) {
      selectedSystem.set(system.name);
    } else {
      selectedSystem.set("");
    }
  };
</script>

<div class="{collapsed ? "system-container" : "system-container open"}"
  on:click="{updateCollapsedStatus}"
>
  <div class="{collapsed ? "chevron-collapse down" : "chevron-collapse"}"  on:click="{() => { collapsed = !collapsed }}">
    <img src="/icon-chevron-up.svg" alt="chevron"/>
  </div>
  <div class="title">
    {system.name}
  </div>
  <div class="body">
    <div class="{collapsed ? "solid-description" : "editable-description"}" transition:fade="{{ duration: 250, delay: 250 }}"
      contenteditable="{!collapsed}"
      on:click="{(e) => { if (!collapsed) e.stopPropagation() }}"
    >
      {system.description}
    </div>
    {#if !collapsed}
      <div class="stats-group" transition:fade="{{ duration: 250 }}">
        <div class="stat-line">
          <p class="key"> Version: </p> <p class="value"> {system.version} </p>
        </div>
        <div class="stat-line">
          <p class="key"> Environment Variables: </p> <p class="value"> {system.envsCount} </p>
        </div>
      </div>
      <div class="stats-group" transition:fade="{{ duration: 250 }}">
        <div class="stat-line">
          <p class="key"> Schemas: </p> <p class="schema-count"> {system.schemasCount} </p>
        </div>
        <div class="stat-line">
          <p class="key"> Business Operations: </p> <p class="bops-count"> {system.bopsCount} </p>
        </div>
        <div class="stat-line">
          <p class="key"> Protocols: </p> <p class="protocol-count"> {system.protocolsCount} </p>
        </div>
      </div>
      <div class="appendix">
        
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
.chevron-collapse {
  position: absolute;
  cursor: pointer;
  left: 12px;
  top: 12px;
  width: 20px;
  height: 15px;
  transform-origin: center;
  transform: rotate(180deg);
  transition: all 250ms;
  // background-color: crimson;

  img {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  &.down {
    transform: rotate(90deg);
  }
}

.system-container {
  background-color: #13131f;
  padding: 6px 6px 28px 6px;
  border-radius: 16px;
  position: relative;
  font-family: 'Dosis', sans-serif;
  font-size: 18px;
  z-index: 0;
  max-height: 150px;
  transition: 250ms;
  cursor: pointer;

  &:not(:first-child) {
    margin-top: 18px;
  }

  &.open {
    max-height: 850px;
  }

  &:hover {
    box-shadow: 0px 0px 15px #6b688b4b;
  }
}

.title {
  text-align: center;
  font-size: 22px;
  cursor: pointer;
}

.editable-description {
  border-radius: 12px;
  background-color: #222233;
  padding: 8px;
  color: #e6e6fe;
  outline: none;
  transition: 500ms;
}

.solid-description {
  border-radius: 12px;
  max-height: 55px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 8px;
}

.stats-group {
  margin-top: 16px;
}

.stat-line {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;

  p {
    color: #676799;
  }

  .value {
    color: white;
  }

  .schema-count {
    color: #5d8efe;
  }

  .bops-count {
    color: #fee162;
  }

  .protocol-count {
    color: #f960ae;
  }
}

.body {
  color: #47476f;
  margin-top: 16px;
  padding: 0 38px;
}
</style>
  
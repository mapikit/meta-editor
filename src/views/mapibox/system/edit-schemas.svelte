<script lang="ts">
import DefinitionApp from "../../../components/system-page/system-editor/definition-app.svelte";
import GuideText from "../../../components/common/guide-text.svelte";
import { onMount } from "svelte";
import { guideText } from "../../../stores/layout-tabs-store";
import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
import { Schema } from "../../../entities/schema";
export const schemaList : Schema[] = []; // Perhaps get from store when it's up?
export const curerntSchemaName = "Schema Test";

// Mocked data
schemaList.push(new Schema(
  {},
  "test schema",
  "Db Protocol",
  "Id",
));

onMount(() => {
  guideText.set(`Configuring Protocol: ${curerntSchemaName}`);
});

</script>
<div class="content">
  <GuideText />
  <div class="schemas-list">
    {#each schemaList as schema}
      <div class="listed-protocol">
        {schema.name} [{schema.identifier}]
      </div>
      <!-- later: change style if it is the current protocol on the route -->
    {/each}
  </div>
  <div class="divider" />
  <div class="editor-lane">
    <div class="solo-fields">
      <div class="field">
        <label> Name </label>
        <input type="text" bind:value={schemaList[0].name}/>
      </div>
      <div class="field">
        <label> Identifier </label>
        <input type="text" bind:value={schemaList[0].identifier}/>
      </div>
      <div class="field">
        <label> Db Protocol </label>
        <input type="text" bind:value={schemaList[0].dbProtocol}/>
      </div>
    </div>
    <DefinitionApp
      protocolDefinition={schemaList[0].format}
      protocolData={{}}
      level={EditorLevels.createDefinition}
      on:confirmed={(data) => { schemaList[0].format = data.detail.mode; }}
    />
  </div>
</div>

<style lang="scss">
  .content {
    margin-top: 42px;
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    font-family: 'Dosis', monospace;
  }

  .divider {
    width: 4px;
    background-color: #1a1a2a;
    height: calc(100% - 90px);
    margin-right: 12px;
    margin-top: 30px;
  }

  .solo-fields {
    margin-bottom: 26px;
    width: 450px;
    padding: 12px;
    border-radius: 12px;
    background-color:#202031;

    .field {
      margin-bottom: 8px;
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: space-between;
      
      label {
        margin-right: 16px;
      }

      input {
        border: none;
        background-color: #323242;
        color: white;
        font-family: "dosis";
        width: 300px;
        text-align: right;
        border-radius: 4px;
        padding: 4px;
      }
    }
  }

  .schemas-list {
    display: flex;
    flex-direction: column;
    width: 286px;
    padding-left: 22px;
    padding-top: 22px;

    .listed-protocol {
      width: calc(100% - 16px);
      height: 35px;
      border-radius: 12px;
      font-size: 14px;
      text-align: center;
      background-color: #1a1a2a;
      display:  flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      transition: all 160ms;
      margin-top: 12px;

      &:hover {
        background-color: #2c2c44;
      }
    }
  }

  .editor-lane {
    max-height: calc(100% - 82px);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .preview {
    max-height: calc(100% - 82px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
</style>
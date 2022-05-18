<script lang="ts">
  import DefinitionApp from "../../../components/system-page/system-editor/definition-app.svelte";
  import GuideText from "../../../components/common/guide-text.svelte";
  import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
  import type { Schema } from "../../../entities/schema";
  import { get } from "svelte/store";
  import { getSchemaById, schemas } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy } from "svelte";
  import { guideText } from "../../../stores/layout-tabs-store";

  let schemaList : Schema[] = $schemas;
  let pathParams = navigation.currentPathParams;
  let currentSchemaId = $pathParams["schemaId"];
  let currentSchema = getSchemaById(currentSchemaId);
  let schemaFormat = currentSchema?.format;

  $: currentSchemaId = $pathParams["schemaId"];
  $: currentSchema = getSchemaById(currentSchemaId);
  $: schemaFormat = currentSchema?.format;

  const unsub = pathParams.subscribe(() => {
    guideText.set(`Editing schema "${get(currentSchema?.name) ?? ""}" (${currentSchemaId})`);
  });

  onDestroy(unsub);

</script>

<div class="content">
  <GuideText />
  <div class="schemas-list">
    {#each schemaList as schema}
      <div
        class:current={currentSchemaId === get(schema.id)}
        class="listed-protocol"
        on:click="{() => { navigation.navigateTo(`/mapibox/system/${$pathParams["systemId"]}/schemas/${get(schema.id)}/edit`); }}">
        {get(schema.name)} [{get(schema.id)}]
      </div>
      <!-- later: change style if it is the current protocol on the route -->
    {/each}
  </div>
  <div class="divider" />
  <div class="editor-lane">
    {#key currentSchemaId}
      {#if schemaList.length !== 0}
        <DefinitionApp
        protocolDefinition={$schemaFormat ?? {}}
        protocolData={{}}
        level={EditorLevels.createDefinition}
        on:confirmed={(data) => {
        schemaFormat.set(data.detail.result.definition.root.subtype);
      }}
      />
      {:else}
        <p> There are no schemas created in this system. </p>
      {/if}
    {/key}
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
    background-color: #202031;

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
        font-family: 'dosis';
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
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      transition: all 75ms;
      margin-top: 12px;
      outline: #1d1d22 solid 0px;

      &:hover {
        background-color: #2c2c44;
      }

      &.current {
        outline: #64647c solid 2px;
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

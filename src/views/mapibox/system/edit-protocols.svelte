<script lang="ts">
  import DefinitionApp from "../../../components/system-page/system-editor/definition-app.svelte";
  import GuideText from "../../../components/common/guide-text.svelte";
  import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";
  import { get, readable } from "svelte/store";
  import { getProtocolById, protocols } from "../../../stores/configuration-store";
  import { navigation } from "../../../lib/navigation";
  import { onDestroy } from "svelte";
  import { guideText } from "../../../stores/layout-tabs-store";
  import type { Protocol } from "../../../entities/protocol";

  let protocolList : Protocol[] = $protocols;
  let pathParams = navigation.currentPathParams;
  let currentProtocolId = $pathParams["protocolId"];
  let currentProtocol = getProtocolById(currentProtocolId);
  let protocolFormat = currentProtocol?.definition;

  $: currentProtocolId = $pathParams["protocolId"];
  $: currentProtocol = getProtocolById(currentProtocolId);
  $: protocolFormat = currentProtocol?.definition;

  const unsub = pathParams.subscribe(() => {
    guideText.set(`Editing Protocol "${get(currentProtocol?.identifier) ?? ""}" (${currentProtocolId})`);
  });

  onDestroy(unsub);

</script>

<div class="content">
  <GuideText />
  <div class="protocols-list">
    {#each protocolList as protocol}
      <div
        class:current={currentProtocolId === get(protocol.id)}
        class="listed-protocol"
        on:click="{() => { navigation.navigateTo(`/mapibox/system/${$pathParams["systemId"]}/protocols/${get(protocol.id)}/edit`); }}">
        {get(protocol.identifier)} [{get(protocol.id)}]
      </div>
      <!-- later: change style if it is the current protocol on the route -->
    {/each}
  </div>
  <div class="divider" />
  <div class="editor-lane">
    {#key currentProtocolId}
      {#if protocolList.length !== 0}
        <div style="cursor: pointer;"
          on:click="{async () => {
            const format = JSON.parse(await navigator.clipboard.readText());
            currentProtocol.definition = format;
            currentProtocol.configuration.set({});
            const newId = Math.floor(Math.random() * 10000000).toString();
            currentProtocol.id = readable(newId);
            navigation.navigateTo(`/mapibox/system/${$pathParams["systemId"]}/protocols/${newId}/edit`);
          }}"
        > Set format here </div>
        <DefinitionApp
        protocolDefinition={protocolFormat ?? {}}
        protocolData={{}}
        level={EditorLevels.signDefinition}
        on:confirmed={(data) => {
        currentProtocol.configuration.set(data.detail.result.data.root);
      }}
      />
      {:else}
        <p> There are no protocols created in this system. </p>
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

  .protocols-list {
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

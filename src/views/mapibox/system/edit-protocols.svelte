<script lang="ts">
import { Protocol } from "../../../entities/protocol";
import { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import ProtocolDefinitionSign from "../../../components/system-page/system-editor/definition-edit-or-sign.svelte";
import GuideText from "../../../components/common/guide-text.svelte";
import { onMount } from "svelte";
import { guideText } from "../../../stores/layout-tabs-store";
import DataPreview from "../../../components/system-page/system-editor/data-preview.svelte";
import { EditorLevels } from "../../../components/object-definition/obj-def-editor-types-and-helpers";

export const protocolDefinition = {
  "port": { "type": "number", "required": true },
  "enableCors": { "type": "boolean" },
  "corsConfig": { "type": "object", "subtype": {
    "origin": { "type": "string", "required": true },
    "optionsSuccessStatus": { "type": "number", "required": true },
  } },
  "routes": { "type": "array", "required": true, "subtype": {
    "route": { "type": "string", "required": true },
    "businessOperation": { "type": "string", "required": true },
    "method": { "type": "enum", "subtype": [ "GET", "PUT", "POST", "PATCH", "DELETE" ], "required": true },
    "inputMapConfiguration": { "type": "array", "required": true, "subtype": {
      "origin": { "type": "enum", "required": true, "subtype": [ "route", "queryParams", "headers", "body" ] },
      "originPath": { "type": "string", "required": true },
      "targetPath": { "type": "string", "required": true },
    } },
    "resultMap": { "type": "object", "required": true, "subtype": {
      "statusCode": { "type": "string", "required": true },
      "headers": { "type": "string", "required": true, "subtype": "cloudedObject" },
      "body": { "type": "cloudedObject", "required": true },
    } },
  } },
};
export let protocolData = {};
export const protocolsList : Protocol[] = []; // Perhaps get from store when it's up?
export const ProtocolName = "TEST PROTOCOL";

// Mocked data
protocolsList.push(new Protocol("HTTP JSON Body", "0.1.66", ProtocolKind.normal));
protocolsList.push(new Protocol("Another Protocol", "0.1.66", ProtocolKind.normal));
protocolsList.push(new Protocol("CRONJOB", "0.1.66", ProtocolKind.normal));

onMount(() => {
  guideText.set(`Configuring Protocol: ${ProtocolName}`);
});

</script>
<div class="content">
  <GuideText />
  <div class="protocols-list">
    {#each protocolsList as protocol}
      <div class="listed-protocol">
        {protocol.protocolName} [{protocol.protocolType}]
      </div>
      <!-- later: change style if it is the current protocol on the route -->
    {/each}
  </div>
  <div class="divider" />
  <div class="editor-lane">
    <ProtocolDefinitionSign
      protocolDefinition={protocolDefinition}
      bind:protocolData={protocolData}
      level={EditorLevels.signDefinition}
      on:confirmed={(data) => { protocolData = data.detail.result; }}
    />
  </div>

  <div class="preview">
    <DataPreview bind:data={protocolData} />
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
<script lang="ts">
import type { ObjectDefinition } from "@meta-system/object-definition";

import { Protocol } from "../../../entities/protocol";
import { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import ProtocolDefinitionSign from "../../../components/system-page/system-editor/protocol-definition-sign.svelte";

export const protocolDefinition : ObjectDefinition = {
  field1: { type: "string" },
  body: { type: "object", subtype: { duration: { type: "string" }, destination: { type: "string" } } },
  dueDate : { type: "date" },
  hasInfluence: { type: "boolean" },
};
export let protocolData = {};
export const protocolsList : Protocol[] = []; // Perhaps get from store when it's up?

// Mocked data
protocolsList.push(new Protocol("HTTP JSON Body", "0.1.66", ProtocolKind.normal));
protocolsList.push(new Protocol("Another Protocol", "0.1.66", ProtocolKind.normal));
protocolsList.push(new Protocol("CRONJOB", "0.1.66", ProtocolKind.normal));

</script>
<div class="content"> 
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
    <ProtocolDefinitionSign protocolDefinition={protocolDefinition} protocolData={protocolData}/>
  </div>

  <div class="preview">

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
    flex: 1;
  }
</style>
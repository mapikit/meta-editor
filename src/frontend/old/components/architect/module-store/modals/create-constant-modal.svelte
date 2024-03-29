<script lang="ts">
  import { get, writable } from "svelte/store";
  import CheckIcon from "../../../../icons/check-icon.svelte";
  import CancelIcon from "../../../../icons/cancel-icon.svelte";
  import TextField from "../../../../components/fields/text-field.svelte";
  import Selector from "../../../../components/common/selector.svelte";
  import BooleanField from "../../../../components/object-definition/editing-fields/boolean-field.svelte";
  import DateField from "../../../../components/object-definition/editing-fields/date-field.svelte";
  import Modal from "../../../../components/modal/modal.svelte";
  import ObjectDefinitionMiniApp from "../../../../components/object-definition/object-definition-mini-app.svelte";
  import { EditorLevel, EditorLevels } from "../../../../components/object-definition/obj-def-editor-types-and-helpers";
  import { getContext } from "svelte";
  import type { UIBusinessOperation } from "../../../../entities/business-operation";
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import type { ArchitectContext } from "src/entities/auxiliary-entities/architect-context";

  export let initialValue : string = undefined;
  export let initialName : string = undefined;
  export let initialType : string = undefined;

  let currentBop = getContext<UIBusinessOperation>("currentBop");
  const context = getContext<ArchitectContext>("architectContext");
  let storeModalOpen = context.storeModalOpen;

  const hasInitial = initialName !== undefined;

  const name = writable(initialName ?? "");
  const type = writable(initialType ?? "string");
  const typeOptions = [
    { label: "String", value: "string" },
    { label: "Number", value: "number" },
    { label: "Boolean", value: "boolean" },
    { label: "Object", value: "object" },
    { label: "Date", value: "date" },
  ];

  const value = writable<unknown>(initialValue ?? "");
  let previousValueBackup : unknown = "";

  let openObjectModal = () => {};
  let closeObjectModal = () => {};

  // eslint-disable-next-line max-lines-per-function
  const confirmConst = () : void => {
    const newValue = { name: get(name), type: get(type), value: get(value) } as BopsConstant;

    if (hasInitial) {
      currentBop.updateConst(initialName, newValue);
      storeModalOpen.set(false);

      return;
    }

    currentBop.constants.update(constants => {
      constants.push(newValue);
      return constants;
    });

    storeModalOpen.set(false);
  };

  const setSelected = (selected) : void => { type.set(selected.value as string); };
  let getObjData;
</script>

<div class="flex flex-row justify-between">
  <div class="text-white font-bold text-lg"> {hasInitial ? "Edit" : "Create New"} Constant </div>
  <div class="flex flex-row">
    <div class="h-full w-7 flex justify-center items-center rounded transition-all border-transparent hover:border-brightGreen border stroke-offWhite hover:stroke-brightGreen cursor-pointer"
      on:click={() => { confirmConst(); }}
    > <CheckIcon style="stroke-inherit"/> </div>
    <div class="ml-2 h-full w-7 flex justify-center items-center rounded border transition-all border-transparent hover:border-ochreYellow stroke-offWhite hover:stroke-ochreYellow cursor-pointer"
      on:click={() => { storeModalOpen.set(false); }}  
    > <CancelIcon style="stroke-inherit"/> </div>
  </div>
</div>
<TextField field="{name}" label="Name" />
<div class="mt-2">
  <p class="text-offWhite text-sm mb-1"> Type </p>
  <Selector bind:field={$type} options="{typeOptions}" onChange={setSelected}/>
</div>
{#if $type === "object"}
  <div class="mt-4 text-center bg-norbalt-200 text-offWhite hover:text-white hover:bg-norbalt-100 transition-all w-20 rounded cursor-pointer text-md"
    on:click={() => { openObjectModal(); previousValueBackup = get(value); value.set({}); }}
  > Set Value </div>
{:else if $type === "string"}
  <TextField field={value} label="Value" placeholder=""/>
{:else if $type === "number"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <input
      bind:value={$value} type="number" class="outline-none app rounded border border-norbalt-100 focus:border-offWhite transition-all bg-norbalt-350 w-full px-1"/>
  </div>
{:else if $type === "boolean"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <div class="bg-norbalt-300 rounded">
      <BooleanField bind:propValue={$value}/>
    </div>
  </div>
{:else if $type === "date"}
  <div class="mt-2">
    <p class="text-offWhite text-sm mb-1"> Value </p>
    <div class="bg-norbalt-300 rounded">
      <DateField bind:propValue={$value}/>
    </div>
  </div>
{/if}

<Modal bind:closeModal={closeObjectModal} bind:openModal={openObjectModal} >
  <div class="flex flex-col" on:click={(e) => { e.stopPropagation(); }}>
    <div class="flex flex-row justify-between">
      <p class="text-lg font-bold mb-3"> Set Constant "{$name}" value </p>
      <div class="flex flex-row h-8">
        <div class="h-full w-7 flex justify-center items-center rounded transition-all border-transparent hover:border-brightGreen border stroke-offWhite hover:stroke-brightGreen cursor-pointer"
          on:click={() => { $value = getObjData().data.root; closeObjectModal(); }}
        > <CheckIcon style="stroke-inherit"/> </div>
        <div class="ml-2 h-full w-7 flex justify-center items-center rounded border transition-all border-transparent hover:border-ochreYellow stroke-offWhite hover:stroke-ochreYellow cursor-pointer"
          on:click={() => { closeObjectModal(); value.set(previousValueBackup); }}
        > <CancelIcon style="stroke-inherit"/> </div>
      </div>
    </div>
    <div class="rounded bg-norbalt-300 w-[586px] h-96">
      <div class="-mb-4"></div>
      <ObjectDefinitionMiniApp
        bind:getDefinitionAndData={getObjData}
        editingLevel={new EditorLevel(EditorLevels.createAndSignDefinition)}
        format={value}
        initialData={{}}
      />
    </div>
  </div>
</Modal>
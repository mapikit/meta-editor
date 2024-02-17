<script lang="ts">
	import Selector from "../../components/selector/selector.svelte";
  import { ViewStore, availableViews } from "../../../entities/stores/view-store";
	import { ViewMutations } from "../../../entities/mutations/view-mutations";
	import { DockViewContent } from "../../../entities/models/dock-view-content";
	import { SelectorOption } from "../../components/selector/select-options-type";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let selectedView : ViewStore<any>;
  let { allAvailableViews } = availableViews;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectorOptions : SelectorOption<DockViewContent<any>>[] = [];

  $: {
    selectorOptions = $allAvailableViews.map((view) => {
      return { label: view.title, value: view };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectView = (selected : SelectorOption<DockViewContent<any>>) : void => {
    ViewMutations.applyViewChange(selectedView, selected.value);
  };
</script>

<Selector options={selectorOptions} field="" styleClass="w-6 h-6" onChange={selectView}/>

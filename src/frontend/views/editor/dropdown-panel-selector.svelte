<script lang="ts">
	import Selector from "../../components/dropdown/selector.svelte";
  import { PanelStore, availablePanels } from "../../../entities/stores/panels-store";
	import { PanelsMutations } from "../../../entities/mutations/panels-mutations";
	import { DockPanelContent } from "../../../entities/models/view-related/dock-panel-content";
	import { SelectorOption } from "../../components/dropdown/select-options-type";

  export let selectedView : PanelStore;
  let { allAvailablePanels: allAvailableViews } = availablePanels;

  let selectorOptions : SelectorOption<DockPanelContent>[] = [];

  $: {
    selectorOptions = $allAvailableViews.map((view) => {
      return { label: view.title, value: view };
    });
  }

  const selectView = (selected : SelectorOption<DockPanelContent>) : void => {
    PanelsMutations.applyPanelChange(selectedView, selected.value);
  };
</script>

<Selector options={selectorOptions} field="" styleClass="ml-1.5 w-6 h-6" onChange={selectView}/>

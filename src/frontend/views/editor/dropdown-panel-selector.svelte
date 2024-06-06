<script lang="ts">
	import Selector from "../../components/selector/selector.svelte";
  import { PanelsStore, availablePanels } from "../../../entities/stores/panels-store";
	import { PanelsMutations } from "../../../entities/mutations/panels-mutations";
	import { DockPanelContent } from "../../../entities/models/view-related/dock-panel-content";
	import { SelectorOption } from "../../components/selector/select-options-type";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export let selectedView : PanelsStore<any>;
  let { allAvailablePanels: allAvailableViews } = availablePanels;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectorOptions : SelectorOption<DockPanelContent<any>>[] = [];

  $: {
    selectorOptions = $allAvailableViews.map((view) => {
      return { label: view.title, value: view };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectView = (selected : SelectorOption<DockPanelContent<any>>) : void => {
    PanelsMutations.applyPanelChange(selectedView, selected.value);
  };
</script>

<Selector options={selectorOptions} field="" styleClass="w-6 h-6" onChange={selectView}/>

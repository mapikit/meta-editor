<script>
import GuideText from "../../components/common/guide-text.svelte";
import SystemsSidebar from "../../components/systems-sidebar/systems-sidebar.svelte";
import { fly } from "svelte/transition";

</script>
<div in:fly={{ x: 150, duration: 250, delay: 250 }} out:fly={{ x: 150, duration: 250 }}>
  <SystemsSidebar />
  <GuideText />
</div>

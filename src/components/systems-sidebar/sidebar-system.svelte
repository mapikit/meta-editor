<script lang="ts">
  import type { SystemData } from "./types";

  export let system : SystemData;
  let collapsed = true;
</script>

<div class="system-container">
  <div class="chevron-collapse" />
  <div class="title">
    {system.name}
  </div>
  <div class="body">
    {system.description}
  </div>
</div>

<style lang="scss">
.chevron-collapse {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 12px;
  height: 12px;
  background-color: whitesmoke;
}

.system-container {
  background-color: #13131f;
  padding: 6px 6px 120px 6px;
  border-radius: 16px;
  position: relative;
  z-index: 0;
  
  &:not(:first-child) {
    margin-top: 18px;
  }
}
</style>
  
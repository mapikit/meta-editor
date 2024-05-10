<script lang="ts">
  import MetaSystemIcon from "./icons/meta-system-icon.svelte";
</script>

<section class="w-full top-0 bg-norbalt-400 h-12 flex items-center p-1 fixed"> <!-- HEADER (TOPBAR) -->
  <div class="w-10 h-12"> <!-- Icon holder-->
    <MetaSystemIcon width={1.8} />
  </div>
</section>

<aside class="bg-norbalt-400 h-[calc(100%_-_48px)] w-12 fixed left-0 top-12"> <!-- Sidebar (Selector) -->
  <!-- icons list goes here -->
</aside>


<div class="mt-12 ml-12 w-[calc(100%_-_48px)] h-[calc(100%_-_48px)] z-0 fixed">
  <slot></slot> <!-- content -->
</div>

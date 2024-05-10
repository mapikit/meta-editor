<script lang="ts">
  import MetaSystemIcon from "./icons/meta-system-icon.svelte";
</script>

<main class="h-full w-full flex flex-col">

  <section class="w-full bg-norbalt-400 h-12 flex items-center p-1"> <!-- HEADER (TOPBAR) -->
    <div class="w-10 h-12"> <!-- Icon holder-->
      <MetaSystemIcon width={1.8} />
    </div>
  </section>

  <main class="flex-1 flex flex-row">
    <aside class="bg-norbalt-400 h-full w-12"> <!-- Sidebar (Selector) -->
      <!-- icons list goes here -->
    </aside>
    <slot></slot> <!-- content -->
  </main>
</main>

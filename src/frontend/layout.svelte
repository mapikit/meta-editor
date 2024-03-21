<script lang="ts">

</script>

<main class="h-full w-full flex flex-col">

  <section class="w-full bg-norbalt-400 h-12 flex items-center p-1"> <!-- HEADER (TOPBAR) -->
    <img class="h-8 w-8 ml-1.5" src="./logo-meta-system.svg" alt="meta-system logo"/>
  </section>
  
  <main class="flex-1 flex flex-row">
    <aside class="bg-norbalt-400 h-full w-12"> <!-- Sidebar (Selector) -->
      <!-- icons list goes here -->
    </aside>
    <slot></slot> <!-- content -->
  </main>
</main>

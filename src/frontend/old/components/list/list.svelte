<script>
  export let contents;
</script>

<div class="list">
		{#each contents as row}
				<slot item={row}>Try Adding Something!</slot>
		{/each}
</div>

<style lang="scss">
  .list {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
  }
</style>



<script lang="ts">
  import Modal from "./modal.svelte";
  
  let closeModal;
  export let openModal;
  export let onSelect = () : void => {};
</script>

<Modal bind:closeModal bind:openModal>
  <div class="w-36 bg-norbalt-300 shadow" on:click="{(e) => e.stopPropagation()}">
    test here :D
    
    <div on:click="{closeModal}">
      close
    </div>
  </div>
</Modal>
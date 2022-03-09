<script>
import ObjectDefinitionEditor from "../../../components/object-definition/object-definition-editor.svelte";

</script>
<div class="center">
 <ObjectDefinitionEditor />
</div>

<style lang="scss">
  .center {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    width: 230px;
    background-color: #202031;
    border-radius: 12px;
    padding: 12px 4px;
  }
</style>

<script>
import ObjectDefinitionMiniApp from "../../../components/object-definition/object-definition-mini-app.svelte";

</script>
<div class="center">
 <ObjectDefinitionMiniApp />
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

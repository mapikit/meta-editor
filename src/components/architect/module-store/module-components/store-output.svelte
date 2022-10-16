<script lang="ts">
  import { typeColors } from "../../../../common/styles/type-colors";

  export let type : string;
</script>
  
  <style lang="scss">
    .nob {
      display: inline-block;
      padding: 1px;
      cursor: default;
    }
  </style>
  
  <span class="nob" style="color: {typeColors[type]}">●</span>

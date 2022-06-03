<script lang="ts">
import { getCurrentMsysConfiguration } from "../../stores/configuration-store";



const downloadConfig = () : void => {
  const data = JSON.stringify(getCurrentMsysConfiguration(), null, 2);
  const element = document.createElement("a");
  element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(data));
  element.setAttribute("download", "msys.json");

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

</script>

<div class="system-props">
  <div on:click="{downloadConfig}">
    BAIXAR CONFIG
  </div>
</div>

<style lang="scss">
.system-props {
  margin-top: 20px;
  cursor: pointer;
}
</style>
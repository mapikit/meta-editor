<script lang="ts">
  const services = [
    { name: "Mapibox", link: "something", icon: "mapibox-icon.svg" },
    { name: "Mapicloud", link: "something-else", icon: "mapicloud-icon.svg" }
  ];

  let selected = "";

  const select = (serviceName : string) : void => {
    selected = serviceName;
  }
</script>

<div class="service-select">
  {#each services as service}
    <div class="service-holder">
      <div
        class="{selected === service.name ? "service selected" : "service"}"
        on:click="{() => select(service.name)}"
      >
        <img alt={service.name} src={"/dashboard-assets/icons/"+service.icon}/>
      </div>
      {#if selected === service.name}
        <div class="selected-mark"/>
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  .service-select {
    height: calc(100vh - 48px);
    width: 84px;
    background-color: #5d2be6;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 16px 0 0 16px;
  }

  .service {
    cursor: pointer;
    height: 56px;
    width: 56px;
    background-color: #6d3afc;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 200ms;

    img {
      width: 32px;
      height: 32px;
    }
  }

  .selected-mark {
    background-color: #3cf691;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    position: absolute;
    right: -5px;
    top: 23px;
    rotate: 45deg;
  }

  .service:hover {
    background-color: #a382ff;
  }

  .service.selected {
    border: 3px solid white;
  }

  .service-holder {
    position: relative;
    overflow: hidden;
    width: 100%;
  }

  .service-holder:not(:first-child) {
    margin-top: 16px;
  }
</style>
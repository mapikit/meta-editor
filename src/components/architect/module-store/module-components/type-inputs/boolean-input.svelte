<script lang="ts">
  export let value = false;
</script>

<label class="switch">
  <input type="checkbox" bind:checked={value}>
  <span class="toggle"><span class="text">{value}</span></span>
</label>

<style lang="scss">
  .text {
    position: absolute;
    left: 50px;
  }

  .switch {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 20px;
    > input {
      opacity: 0;
      width: 0;
      height: 0;
    }
  }

  .toggle {
    position: absolute;
    cursor: pointer;
    border-radius: 50px;
    height: 18px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .toggle:before {
    border-radius: 50%;
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 1.5px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  } 

  input:checked + .toggle {
    background-color: #2196F3;
  }

  input:checked + .toggle:before {
    transform: translateX(22px);
  }
</style>
<script lang="ts">

  export let clickFunction : () => void;
  export let hoverColor : "yellow" | "blue" | "green" | "red" | "default" = "default";
  let clazz : string = "w-full h-full";

  export { clazz as class };

  let color = hoverColor === "yellow"
    ? "hover:text-ochreYellow" : hoverColor === "blue"
      ? "hover:text-royalBlue" : hoverColor === "green"
        ? "hover:text-brightGreen" : hoverColor === "red"
          ? "hover:text-roseRed" : "hover:text-white";

  let hoverOutlineColor = hoverColor === "yellow"
    ? "hover:outline-ochreYellow" : hoverColor === "blue"
      ? "hover:outline-royalBlue" : hoverColor === "green"
        ? "hover:outline-brightGreen" : hoverColor === "red"
          ? "hover:outline-roseRed" : "hover:outline-norbalt-100";
</script>

<button class="bg-norbalt-400 ochre {clazz} rounded transition-all
 text-offWhite {color} flex justify-center items-center text-lg
 outline outline-2 outline-norbalt-200 {hoverOutlineColor}"
on:click={clickFunction}>
  <slot>

  </slot>
</button>

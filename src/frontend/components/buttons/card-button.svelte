<script lang="ts">

  export let clickFunction : () => void;
  export let hoverColor : "yellow" | "blue" | "green" | "red" | "default" = "default";
  let clazz : string = "w-full h-full";
  export let noOutline : boolean = false;

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

  let outlineStyle = "outline outline-2 outline-norbalt-200 " + hoverOutlineColor;
</script>

<button class="bg-norbalt-400 ochre rounded transition-all
 text-offWhite {color} flex justify-center items-center text-lg
 {noOutline ? "outline-none" : outlineStyle} {clazz}"
on:click={clickFunction}>
  <slot>

  </slot>
</button>

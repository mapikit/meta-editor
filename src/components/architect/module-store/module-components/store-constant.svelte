<script lang="ts">
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
  import { getClosest } from "../../../../common/helpers/get-closest";
  import { typeColors } from "../../../../common/styles/type-colors";

  let moving = false;
  let newCard : HTMLDivElement;
  let ref : HTMLDivElement;
  let left = 0;
  let top = 0;
  let availableInputs : NodeListOf<HTMLSpanElement>;

  function startMovement (event : MouseEvent) {
    moving = event.button === 0;
    const achitectRef = document.getElementById("architect")
    newCard = achitectRef.appendChild(ref.cloneNode(true)) as HTMLDivElement;
    availableInputs = achitectRef.querySelectorAll("#InputNob");
    newCard.style.position = "absolute";
    newCard.style.zIndex = "4"
    const currentPos = ref.getBoundingClientRect();
    newCard.style.width = `${currentPos.width}px`
    top = currentPos.y;
    left = currentPos.x;
    newCard.style.left = `${left}px`;
    newCard.style.top = `${top}px`;

    ref.style.visibility = "hidden"
  }

  function stopMovement () {
    moving = false;
    if(newCard !== undefined) {
      availableInputs.forEach(nob => nob.style.boxShadow = "none")
      const closestInRange : [number, HTMLSpanElement] = getClosest(availableInputs, newCard.getBoundingClientRect());
      newCard.remove();
      ref.style.visibility = "visible"

      if(closestInRange[1] !== undefined) {
        const event = new CustomEvent("appendTag", { 
          detail: { constant } 
        })
        closestInRange[1].dispatchEvent(event)
      }
      newCard = undefined;

    }
    left = top = 0;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      left += event.movementX;
      top += event.movementY;
      newCard.style.left = `${left}px`;
      newCard.style.top = `${top}px`;
      let closestInRange : [number, HTMLSpanElement] = getClosest(availableInputs, newCard.getBoundingClientRect());

      availableInputs.forEach(nob => {
        if(nob !== closestInRange[1]) nob.style.boxShadow = "none";
        else closestInRange[1].style.boxShadow = "0 0 4px 4px #0ff";
      })
    }
  }
  export let constant : BopsConstant;
</script>

<div class="constant" bind:this={ref} on:mousedown={startMovement}>
  <span class="name">{constant.name}: </span><span 
    class="indicator" style="color: {typeColors[constant.type]};"> <abbr title={constant.value.toString()} class="text">{constant.value}</abbr> ●</span>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .constant {
    position: relative;
    user-select: none;
    background-color: #191928;
    border-radius: 20px 0 0 20px;
    padding: 1px 19px 3px 10px;
    text-align:  left;
    width: 100%;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  }

  .text {
    display: inline-block;
    overflow: hidden;
    vertical-align: bottom;
    text-overflow: ellipsis;
    max-width: 8vw;
    white-space: nowrap;
    text-decoration: none;
  }

  // .indicator {
  //   text-align: right;
  //   justify-self: right;
  // }
</style>
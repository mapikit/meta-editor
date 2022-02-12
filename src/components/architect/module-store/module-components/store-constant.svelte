<script lang="ts">
  import type { BopsConstant } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
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
    newCard.style.width = `${ref.getBoundingClientRect().width}px`
    newCard.style.zIndex = "4"
    const currentPos = ref.getBoundingClientRect();
    top = currentPos.y;
    left = currentPos.x;
    newCard.style.left = `${currentPos.x}px`;
    newCard.style.top = `${currentPos.y}px`;
    ref.style.visibility = "hidden"
  }

  function stopMovement () { 
    moving = false;
    if(newCard !== undefined) {
      // bopStore.update(bop => {
      //   return bop;
      // })
      availableInputs.forEach(nob => nob.style.boxShadow = "none")
      newCard.remove()
      newCard = undefined;
      ref.style.visibility = "visible"
    }
    left = top = 0;
  }

  function moveCard (event : MouseEvent) {
    if(moving) {
      left += event.movementX;
      top += event.movementY;
      newCard.style.left = `${left}px`;
      newCard.style.top = `${top}px`;
      let closestInRange : [number, HTMLSpanElement] = [-1, undefined];
      availableInputs.forEach(nob => {
        const inputPos = nob.getBoundingClientRect();
        const thisRect = ref.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow((left + thisRect.width)-inputPos.x, 2) + 
          Math.pow((top + thisRect.height/2)-inputPos.y, 2)
        )
        if(distance < 80 && (distance < closestInRange[0] || closestInRange[0] === -1)){
          closestInRange = [distance, nob];
        }
      })
        

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
    class="indicator" style="color: {typeColors[constant.type]};"> {constant.value} ●</span>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .constant {
    user-select: none;
    background-color: #191928;
    border-radius: 20px 0 0 20px;
    width: 90%;
    padding: 5px 0 5px 0;
    margin: 3px 5% 0 5%;
  }

  .indicator {
    text-align: right;
    justify-self: right;
  }
</style>
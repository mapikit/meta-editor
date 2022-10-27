<script lang="ts">
import beautify from "json-beautify";
import type { BopsConfigurationEntry, BopsConstant, Dependency }
  from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import CrossIcon from "../../../../icons/cross-icon.svelte";
import type { Writable } from "svelte/store";
import { getClosest } from "../../../../common/helpers/get-closest";
import { typeColors } from "../../../../common/styles/type-colors";
import { environment } from "../../../../stores/environment";
import { sectionsMap } from "../../helpers/sections-map";

export let bopModules : Writable<BopsConfigurationEntry[]>;
export let constant : BopsConstant;

let moving = false;
let newCard : HTMLDivElement;
let ref : HTMLDivElement;
let left = 0;
let top = 0;
let availableInputs : NodeListOf<HTMLSpanElement>;

function startMovement (event : MouseEvent) : void {
  moving = event.button === 0;
  const achitectRef = document.getElementById("architect");
  newCard = achitectRef.appendChild(ref.cloneNode(true)) as HTMLDivElement;
  availableInputs = achitectRef.querySelectorAll("#input");
  newCard.style.position = "absolute";
  newCard.style.zIndex = "4";
  const currentPos = ref.getBoundingClientRect();
  newCard.style.width = `${currentPos.width}px`;
  top = currentPos.y - $environment.canvasOffset.y;
  left = currentPos.x - $environment.canvasOffset.x;
  newCard.style.left = `${left}px`;
  newCard.style.top = `${top}px`;

  ref.style.visibility = "hidden";
}

// eslint-disable-next-line max-lines-per-function
function stopMovement () : void {
  moving = false;
  if(newCard !== undefined) {
    availableInputs.forEach(nob => { nob.style.boxShadow = "none"; });
    const closestInRange : [number, HTMLSpanElement] = getClosest(availableInputs, newCard.getBoundingClientRect());
    ref.style.visibility = "visible";

    if(closestInRange[1] !== undefined) {
      const arrayPath : Array<string> = closestInRange[1].getAttribute("data").split(".");
      const [parentKey, targetPath] = [Number(arrayPath[0]), arrayPath.slice(1).join(".")];
      bopModules.update(modules => {
        const cardToAdd = modules.find(module => module.key === parentKey);
        const newConstDependency : Dependency = {
          origin: "constant",
          originPath: constant.name,
          targetPath,
        };
        const alreadyPresentIndex = cardToAdd.dependencies
          .findIndex(dependency => dependency.targetPath === targetPath);
        if(alreadyPresentIndex !== -1) {
          cardToAdd.dependencies.splice(alreadyPresentIndex, 1);
        }
        cardToAdd.dependencies.push(newConstDependency);
        return modules;
      });
    }
    newCard?.remove();
    newCard = undefined;

    sectionsMap.refreshConnections($bopModules);
  }
  left = top = 0;
}

const removeConst = () : void => {
  // TODO
}

// eslint-disable-next-line max-lines-per-function
function moveCard (event : MouseEvent) : void {
  if(moving) {
    const scale = $environment.scale;

    left += event.movementX;
    top += event.movementY;
    newCard.style.left = `${left}px`;
    newCard.style.top = `${top}px`;
    newCard.style.transform = `scale(${$environment.scale})`;

    let closestInRange : [number, HTMLSpanElement] = getClosest(availableInputs, newCard.getBoundingClientRect());

    availableInputs.forEach(nob => {
      switch (closestInRange[1]) {
        case undefined:
          newCard.style.filter = "none";
          break;
        case nob:
          const a = newCard.getBoundingClientRect();
          const b = nob.getBoundingClientRect();

          newCard.style.filter = `drop-shadow(${(b.x-a.x-a.width)/scale + 22}px ${(b.y-a.y)/scale - 3}px 0 #fffa)`;
          // closestInRange[1].style.boxShadow = "0 0 4px 4px #0ff";
          break;
        default:
          nob.style.boxShadow = "none";
          break;
      }
    });
  }
}

function getExtendedString (value : unknown) : string {
  if(typeof value === "object") return beautify(value, null, 1);
  return value.toString();
}
</script>
<div class="total mt-1 h-7 flex flex-row w-full transition-all" bind:this={ref} on:mousedown={startMovement}>
  <div class="bg-norbalt-350 h-full max-w-full rounded-l-full select-none relative pr-6 pl-3 constant-nip">
    <div class="name">{constant.name}: </div>
    <abbr title={getExtendedString(constant.value)} class="text" style="color: {typeColors[constant.type]};">{constant.value}</abbr>
    <div class="indicator" style="color: {typeColors[constant.type]};">  ●</div>
  </div>
  <div class="h-full flex justify-center items-center ml-2 pt-2 stroke-offWhite hover:stroke-roseRed cursor-pointer transition-all"
    on:click={() => { removeConst(); }}
  >
    <CrossIcon style="stroke-inherit"/>
  </div>
</div>
<svelte:window on:mousemove={moveCard} on:mouseup={stopMovement}/>

<style lang="scss">
  .total {
    transition: filter 30ms cubic-bezier(0.075, 1.045, 0.805, 0.980), transform 500ms ease-in-out;
    width: 100%;
  }

  .constant-nip {
    margin-top: 3px;
    text-align:  left;
    clip-path: polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%);
  }

  .indicator {
    text-align: right;
    display: inline-block;
    max-width: 16px;
    grid-column: 2;
  }

  .name {
    display: inline;
    max-width: 20%;
  }

  .text {
    display: inline-block;
    max-width: calc(80% - 16px);
    overflow: hidden;
    vertical-align: bottom;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
  }
</style>
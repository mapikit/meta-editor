import { bopStore } from "../../../stores/bop-store";
import type { NobSelection } from "../../../stores/connection-stores";
import type { UICompliantDependency } from "../../../common/types/module-card";


// TODO breakdown this function and overall rework
// In the future this will likely be biggest function of the architect as it
// should be able to verify types and loops
export function solveConnection (currentNob : NobSelection, clickedNob : NobSelection) : NobSelection {
  if(currentNob === undefined) {
    clickedNob.nob.style.outline = "solid #ffffff 2px";
    return clickedNob;
  }
  if(currentNob.nobType === clickedNob.nobType) {
    window.alert("Inputs may only be connected to outputs and vice versa");
  } else {
    clickedNob.nob.style.outline = "solid white 2px;";
    bopStore.update((currentBOp) => {
      const currentIsOutput = currentNob.nobType === "output";

      const [origin, target] = currentIsOutput ? [currentNob, clickedNob] : [clickedNob, currentNob];

      const targetModule = currentBOp.configuration.find(module => module.key == target.parentCard.key);

      const newDependency : UICompliantDependency = {
        origin: origin.parentCard.key,
        originPath: `result.${origin.property}`,
        targetPath: target.property,
        originNob: origin.nob,
        targetNob: target.nob,
        matchingType: (origin.propertyType === target.propertyType) || target.propertyType === "any",
      };


      const alreadyPresent = targetModule.dependencies.findIndex(dep => dep.targetPath === newDependency.targetPath);


      if(alreadyPresent !== -1) {
        targetModule.dependencies.splice(alreadyPresent, 1);
        target.nob.dispatchEvent(new Event("removeTag"));
      }
      targetModule.dependencies.push(newDependency);


      // if(moduleConnections[identifier] !== undefined) {
      //   delete moduleConnections[identifier];
      // } else {
      //   const inputConnectionIndicator = identifier.split("-")[1]
      //   if(Object.keys(moduleConnections).find(key => key.includes(inputConnectionIndicator))) {
      //     window.alert("Inputs can't have multiple connections\n(Delete by re-connecting)")
      //   } else moduleConnections[identifier] = [origin.nob, target.nob];
      // }

      return currentBOp;
    });
  }
  currentNob.nob.style.outline = "";
  return undefined;
}

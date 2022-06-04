import type { NobSelection } from "../../../stores/connection-stores";
import type { UICompliantDependency } from "../../../common/types/module-card";
import type { Writable } from "svelte/store";
import type {
  BopsConfigurationEntry,
} from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { SectionsMap, sectionsMap } from "./sections-map";


// TODO breakdown this function and overall rework
// In the future this will likely be biggest function of the architect as it
// should be able to verify types and loops
// eslint-disable-next-line max-lines-per-function
export function solveConnection (currentNob : NobSelection, clickedNob : NobSelection, bopModules : Writable<BopsConfigurationEntry[]>) : NobSelection {

  if(currentNob === undefined) {
    clickedNob.nob.style.outline = "solid #ffffff 2px";
    return clickedNob;
  }
  if(currentNob.nobType === clickedNob.nobType) {
    window.alert("Inputs may only be connected to outputs and vice versa");
  } else {
    clickedNob.nob.style.outline = "solid white 2px;";
    // eslint-disable-next-line max-lines-per-function
    bopModules.update((modules) => {
      const currentIsOutput = ["output", "module"].includes(currentNob.nobType);
      const [origin, target] = currentIsOutput ? [currentNob, clickedNob] : [clickedNob, currentNob];

      const targetModule = modules.find(module => module.key == target.parentKey);


      const originPath = origin.parentKey === "input" ? origin.property
        : origin.nobType === "module" ? "module" : `result.${origin.property}`;

      const newDependency : UICompliantDependency = {
        origin: origin.parentKey,
        originPath,
        targetPath: target.property,
        matchingType: (origin.propertyType === target.propertyType) || target.propertyType === "any",
      };


      const alreadyPresent = targetModule.dependencies.findIndex(dep => dep.targetPath === newDependency.targetPath);


      if(alreadyPresent !== -1) {
        targetModule.dependencies.splice(alreadyPresent, 1);
        target.nob.dispatchEvent(new Event("removeTag"));
        sectionsMap.removeConnection(SectionsMap.getIdentifier(targetModule.key, newDependency.targetPath));
      }

      targetModule.dependencies.push(newDependency);
      sectionsMap.addConnection(newDependency, target.parentKey);

      return modules;
    });
  }
  currentNob.nob.style.outline = "";
  return undefined;
}

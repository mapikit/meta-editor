import type { ConnectionPointSelection } from "../../../stores/knob-selection-type";
import type { UICompliantDependency } from "../../../common/types/module-card";
import { get, Writable } from "svelte/store";
import type {
  BopsConfigurationEntry,
} from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import { SectionsMap, sectionsMap } from "./sections-map";

// TODO breakdown this function and overall rework
// In the future this will likely be biggest function of the architect as it
// should be able to verify types and loops
// eslint-disable-next-line max-lines-per-function
export function solveConnection (
  currentKnob : ConnectionPointSelection,
  targetKnob : ConnectionPointSelection,
  bopModules : Writable<BopsConfigurationEntry[]>,
) : void {
  if(currentKnob === undefined) return;
  if(currentKnob.connectionType === targetKnob.connectionType) return;

  const currentIsOutput = ["output", "module"].includes(currentKnob.connectionType);
  const [origin, target] = currentIsOutput ? [currentKnob, targetKnob] : [targetKnob, currentKnob];

  if(target.connectionType === "functional") return addFunctionalDependency(origin, target, bopModules);

  // eslint-disable-next-line max-lines-per-function
  bopModules.update((modules) => {
    const targetModule = modules.find(module => module.key == target.parentKey);

    const newDependency : UICompliantDependency = {
      origin: origin.parentKey,
      originPath: origin.property,
      targetPath: target.property,
      matchingType: (origin.propertyType === target.propertyType) || target.propertyType === "any",
    };

    const alreadyPresent = targetModule.dependencies.findIndex(dep => dep.targetPath === newDependency.targetPath);

    if(alreadyPresent !== -1) {
      targetModule.dependencies.splice(alreadyPresent, 1);
      target.element.dispatchEvent(new Event("removeTag"));
      sectionsMap.removeConnection(SectionsMap.getIdentifier(targetModule.key, newDependency.targetPath));
    }

    targetModule.dependencies.push(newDependency);
    sectionsMap.addConnection(newDependency, target.parentKey);

    return modules;
  });

  currentKnob.element.style.outline = "";
  return undefined;
}


function addFunctionalDependency (
  origin : ConnectionPointSelection, target : ConnectionPointSelection, bopModules : Writable<BopsConfigurationEntry[]>) : void
{
  if(origin.connectionType !== "module") return window.alert("Functional Dependencies only connect to modules");

  bopModules.update(modules => {
    const targetModule = get(bopModules).find(module => module.key == target.parentKey);
    const alreadyPresent = targetModule.dependencies.findIndex(dependency => {
      return dependency.origin === origin.parentKey && dependency.targetPath === undefined;
    });
    if(alreadyPresent !== -1) targetModule.dependencies.splice(alreadyPresent, 1);

    targetModule.dependencies.unshift({ origin: origin.parentKey });
    return modules;
  });
}

import { selectedSystem } from "../components/systems-sidebar/systems-stores";
import { derived, get, Writable, writable } from "svelte/store";
import { Project } from "../entities/project";

export const availableProjects : Writable<Project[]> = writable([]);

export const currentProject = derived(selectedSystem,
  $selectedSystem => {
    const result = get(availableProjects).find((project) => get(project.id) === $selectedSystem)
      ?? Project.getNullable();

    console.log("CURRENT SELECTED: ", $selectedSystem, get(result.id));

    return result;
  });


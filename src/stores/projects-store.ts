import { selectedSystem } from "../components/systems-sidebar/systems-stores";
import { derived, get, Writable, writable } from "svelte/store";
import { Project } from "../entities/project";
import { localStorageService } from "../services/local-storage-service";

export const availableProjects : Writable<Project[]> = writable([]);

export const saveProjects = () : void => {
  const projects = get(availableProjects);
  const savingData = projects.map((project) => project.serialized());

  localStorageService.save("projects", savingData);
};

export const loadProjectsFromStore = () : void => {
  if (localStorageService.isInStorage("projects")) {
    const projectsData = localStorageService.fetchKey("projects") as object[];
    const rawProjects = [];

    projectsData.forEach((value) => {
      rawProjects.push(new Project(value as any));
    });

    availableProjects.update((projects) => {
      projects.push(...rawProjects);
      return projects;
    });
  };

  availableProjects.subscribe(saveProjects);
};

export const currentProject = derived(selectedSystem,
  $selectedSystem => {
    const result = get(availableProjects).find((project) => get(project.id) === $selectedSystem)
      ?? Project.getNullable();

    return result;
  });

window["availableProjects"] = availableProjects;
window["getter"] = get;

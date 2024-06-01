import { InjectedWindow } from "../../../common/types/injected-window";
import { Project } from "../../models/project";
import { EditorMetadataMutations } from "../../mutations/editor-metadata-mutations";
import { editorMetadataStoreSingleton } from "../../stores/editor-metadata-store";
import { get } from "svelte/store";

export class ProjectsFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  // Archive functions
  public static async archive (project : Project) : Promise<void> {
    await this.fileApi.archiveProject(project.toJson());
  }

  // Delete Functions
  public static async delete (project : Project) : Promise<void> {
    await this.fileApi.deleteProject(project.toJson());
  }

  public static async getList () : Promise<string[]> {
    await EditorMetadataMutations.loadData();
    return get(editorMetadataStoreSingleton.data).availableProjectsIds;
  }

  // Load Functions
  public static async readProjectFile (projectIdentifier : string) : Promise<Project> {
    const projectInfo = await this.fileApi.getProjectInfo(projectIdentifier);
    if(!projectInfo) throw Error("No config file found for project: " + projectIdentifier);
    return new Project(projectInfo);
  }

  // Update Functions
  public static async update (parentProject : Project) : Promise<void> {
    await this.fileApi.saveProjectInfo(parentProject.toJson());
  }
}

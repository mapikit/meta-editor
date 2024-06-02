import { get } from "svelte/store";
import { EditorMetadata } from "../models/editor-metadata";
import { editorMetadataStoreSingleton } from "../stores/editor-metadata-store";
import { EditorMetadataMutations } from "../mutations/editor-metadata-mutations";
import { ProjectsController } from "./projects-controller";
import { EditorMetadataFileSystemController } from "./file-system-controller-functions/editor-metadata";

export class EditorMetadataController {
  public static async loadMetadata () : Promise<void> {
    const editorData = await EditorMetadataFileSystemController.getMetadata();
    const metadata = EditorMetadata.fromSerializable(editorData);
    EditorMetadataMutations.setData(metadata);

    metadata.availableProjectsIds.forEach(async (projectId) => {
      await ProjectsController.loadProject(projectId);
    });
  }

  public static async appendProjectIdentifier (identifier : string) : Promise<void> {
    editorMetadataStoreSingleton.data.update((v) => { v.availableProjectsIds.push(identifier); return v; });
  }

  public static async saveCurrentMetadata () : Promise<void> {
    const currentData = get(editorMetadataStoreSingleton.data);
    await EditorMetadataFileSystemController.saveMetadata(currentData);
  }
}

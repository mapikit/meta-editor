import { EditorMetadataController } from "../controllers/editor-metadata-controller";
import { ProjectsController } from "../controllers/projects-controller";
import { editorMetadataStoreSingleton } from "../stores/editor-metadata-store";

export class EditorMetadataMutations {
  public static async loadData () : Promise<void> {
    const metadata = await EditorMetadataController.loadMetadata();
    editorMetadataStoreSingleton.data.set(metadata);

    metadata.availableProjectsIds.forEach(async (projectId) => {
      await ProjectsController.loadProject(projectId);
    });
  }
}

import { EditorMetadata } from "../models/editor-metadata";
import { editorMetadataStoreSingleton } from "../stores/editor-metadata-store";

export class EditorMetadataMutations {
  public static setData (metadata : EditorMetadata) : void {
    editorMetadataStoreSingleton.data.set(metadata);
  }

  public static removeProject (projectId : string) : void {
    editorMetadataStoreSingleton.data.update(current => {
      current.availableProjectsIds = current.availableProjectsIds.filter(p => p !== projectId);
      return current;
    });
  }
}

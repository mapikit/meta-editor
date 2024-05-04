import { SerializableEditorMetadata } from "../../common/types/serializables/serialized-editor-metadata";
import { Project } from "./project";

// This is singleton :)
// If user deletes the file, it will mean the user will reset the editor to factory.
export class EditorMetadata {
  public availableProjects : Map<string, Project> = new Map();

  public static newEmptySerializable () : SerializableEditorMetadata {
    return {
      availableProjectsIds: [],
    };
  }
}

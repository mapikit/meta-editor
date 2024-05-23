import { SerializableEditorMetadata } from "../../common/types/serializables/serialized-editor-metadata";

// This is singleton :)
// If user deletes the file, it will mean the user will reset the editor to factory.
export class EditorMetadata {
  public availableProjectsIds : string[] = [];

  public static newEmptySerializable () : SerializableEditorMetadata {
    return {
      availableProjectsIds: [],
    };
  }

  public static fromSerializable (serializable : SerializableEditorMetadata) : EditorMetadata {
    const result = new EditorMetadata();
    result.availableProjectsIds = [].concat(serializable.availableProjectsIds);

    return result;
  }

  public toSerializable () : SerializableEditorMetadata {
    return  { availableProjectsIds: this.availableProjectsIds };
  }
}

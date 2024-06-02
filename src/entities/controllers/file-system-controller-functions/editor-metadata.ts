import { SerializableEditorMetadata } from "../../../common/types/serializables/serialized-editor-metadata";
import { InjectedWindow } from "../../../common/types/injected-window";
import { EditorMetadata } from "../../models/editor-metadata";

export class EditorMetadataFileSystemController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async getMetadata () : Promise<SerializableEditorMetadata> {
    return this.fileApi.fetchEditorMetadata();
  }

  public static async saveMetadata (metadata : EditorMetadata) : Promise<void> {
    await this.fileApi.saveEditorMetadata(metadata.toSerializable());
  }
}

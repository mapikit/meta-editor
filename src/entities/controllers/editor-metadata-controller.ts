import { InjectedWindow } from "../../common/types/injected-window";
import { EditorMetadata } from "../models/editor-metadata";

export class EditorMetadataController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async loadMetadata () : Promise<EditorMetadata> {
    const editorData = await this.fileApi.fetchEditorMetadata();
    return EditorMetadata.fromSerializable(editorData);
  }
}

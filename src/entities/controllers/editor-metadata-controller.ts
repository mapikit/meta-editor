import { get } from "svelte/store";
import { InjectedWindow } from "../../common/types/injected-window";
import { EditorMetadata } from "../models/editor-metadata";
import { editorMetadataStoreSingleton } from "../stores/editor-metadata-store";

export class EditorMetadataController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async loadMetadata () : Promise<EditorMetadata> {
    const editorData = await this.fileApi.fetchEditorMetadata();
    return EditorMetadata.fromSerializable(editorData);
  }

  public static async appendProjectIdentifier (identifier : string) : Promise<void> {
    editorMetadataStoreSingleton.data.update((v) => { v.availableProjectsIds.push(identifier); return v; });
  }

  public static async saveCurrentMetadata () : Promise<void> {
    const currentData = get(editorMetadataStoreSingleton.data);
    await this.fileApi.saveEditorMetadata(currentData.toSerializable());
  }
}

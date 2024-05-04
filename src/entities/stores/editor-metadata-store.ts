import { Writable, writable } from "svelte/store";
import { EditorMetadata } from "../models/editor-metadata";

class EditorMetadataStore {
  public readonly data : Writable<EditorMetadata> = writable(null);
}

export const editorMetadataStoreSingleton = new EditorMetadataStore();

import { InjectedWindow } from "../../common/types/injected-window";

export class EditorMetadataController {
  private static fileApi = (window as InjectedWindow).fileApi;

  public static async loadMetadata () : Promise<void> {
    // const editorData = await this.fileApi.fetchEditorMetadata();
  }

  public static async createMetadata () : Promise<void> {
    await this.fileApi.createEditorMetadata();
    console.log("teste");
  }
}

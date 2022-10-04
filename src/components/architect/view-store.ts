// eslint-disable-next-line max-classes-per-file
import { writable, Writable } from "svelte/store";

export enum Tools {
  selectTool,
  panTool,
  cutTool
}

class ToolsController {
  public readonly currentTool : Writable<Tools> = writable(Tools.selectTool);

  public useSelectTool () : void {
    this.currentTool.set(Tools.selectTool);
  }

  public usePanTool () : void {
    this.currentTool.set(Tools.panTool);
  }

  public useCutTool () : void {
    this.currentTool.set(Tools.cutTool);
  }
}

export const toolsController = new ToolsController();

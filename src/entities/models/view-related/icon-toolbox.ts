/* eslint-disable max-classes-per-file */
import { ComponentType } from "svelte";

export class ToolboxAction {
  public constructor (
    public actionText : string,
    public description : string,
    public action : () => void,
  ) {}
}

export class IconToolboxData {
  public icon : ComponentType /*Svelte Component*/ = null;
  public text : string;
  public actions : ToolboxAction[] = [];

  public constructor (icon : ComponentType, text : string) {
    this.icon = icon;
    this.text = text;
  }
}

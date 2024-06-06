/* eslint-disable max-classes-per-file */
export class ToolboxAction {
  public constructor (
    public actionText : string,
    public description : string,
    public action : () => void,
  ) {}
}

export class IconToolboxData {
  public icon : unknown /*Svelte Component*/ = null;
  public text : string;
  public actions : ToolboxAction[] = [];

  public constructor (icon : unknown, text : string) {
    this.icon = icon;
    this.text = text;
  }
}

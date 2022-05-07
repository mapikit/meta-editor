export enum EditorLevels {
  createDefinition,
  signDefinition,
  createAndSignDefinition,
  readonly
}

export class EditorLevel {
  public constructor (
    public readonly level : EditorLevels,
  ) {}

  public canAddProperty () : boolean {
    return this.level !== EditorLevels.signDefinition;
  }

  public canAddData () : boolean {
    return this.level !== EditorLevels.createDefinition;
  }
}

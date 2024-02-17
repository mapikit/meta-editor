export type MetaEditorInfoType = {
  businessOperations : {
    [bopId : string] : Array<{
      key : number;
      x : number;
      y : number;
    }>
  }
}

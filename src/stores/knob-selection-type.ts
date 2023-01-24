export type ConnectionPointSelection = {
  connectionType : "input" | "output" | "module" | "functional";
  propertyType : string;
  property : string;
  element : HTMLElement;
  parentKey : number | "input";
}

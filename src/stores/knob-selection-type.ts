export type ConnectionPointSelection = {
  pointType : "input" | "output" | "module" | "functional";
  propertyType : string;
  property : string;
  element : HTMLElement;
  parentKey : number | "input";
}

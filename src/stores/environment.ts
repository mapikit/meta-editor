import { writable } from "svelte/store";
import { Coordinate } from "../common/types/geometry";

export type EnvType = {
  scale : number;
  distributionColumn : number; //TEMP
  canvasContext : CanvasRenderingContext2D
  origin : Coordinate;
  functionalTraces : boolean;
  canvasOffset : DOMRect;
}


export const environment = writable<EnvType>({
  scale: 1,
  distributionColumn: 0.4,
  canvasContext: undefined,
  canvasOffset: undefined,
  origin: new Coordinate(0,0),
  functionalTraces: false,
});

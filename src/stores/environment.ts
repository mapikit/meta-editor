import { writable } from "svelte/store";
import { Coordinate } from "../common/types/geometry";

export type EnvType = {
  scale : number;
  distributionColumn : number; //TEMP
  debugCanvasCtx : CanvasRenderingContext2D
  origin : Coordinate;
  debug : any; //TODO Remove debug property
}


export const environment = writable<EnvType>({
  debug : {},
  scale: 1,
  distributionColumn: 0.4,
  debugCanvasCtx: undefined,
  origin: new Coordinate(0,0),
});

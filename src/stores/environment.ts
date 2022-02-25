import { writable } from "svelte/store";

type EnvType = {
  scale: number;
  distributionColumn: number;
  debugCanvasCtx: CanvasRenderingContext2D
}


export const environment = writable<EnvType>({
  scale: 1,
  distributionColumn: 0.4,
  debugCanvasCtx: undefined
})
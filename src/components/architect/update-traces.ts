import type { CoordinateInfo } from "../../common/types/geometry";
import { sectionsMap } from "./helpers/sections-map";
import { environment } from "../../stores/environment";
import { get } from "svelte/store";


export type ExtraTracingInfo = {
  cutting ?: MouseEvent;
  cursor ?: MouseEvent;
}



// eslint-disable-next-line max-lines-per-function
export function updateTraces (extraInfo ?: ExtraTracingInfo)
  : Array<string> {

  const env = get(environment);
  const canvasContext = env.canvasContext;
  const moduleDash = [10, 4, 2, 4].map(value => value*env.scale);

  const linesToCut : Array<string> = [];
  canvasContext.shadowColor = "red";

  const canvasOffset = canvasContext.canvas.getBoundingClientRect();

  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

  canvasContext.shadowBlur = 0;

  canvasContext.strokeStyle = "#303030";
  canvasContext.setLineDash(moduleDash);
  canvasContext.beginPath();
  canvasContext.moveTo(env.origin.x, 0);
  canvasContext.lineTo(env.origin.x, canvasContext.canvas.height);
  canvasContext.moveTo(0, env.origin.y);
  canvasContext.lineTo(canvasContext.canvas.width, env.origin.y);
  canvasContext.stroke();


  for(const outputId of Object.keys(sectionsMap.connections)) {
    if(sectionsMap.output[outputId] === null || sectionsMap.output[outputId] === undefined) continue;
    if(outputId.split(".")[1] === "module") {
      canvasContext.strokeStyle = "#dddd22";
      canvasContext.setLineDash(moduleDash);
    } else {
      canvasContext.strokeStyle = "#dddddd";
      canvasContext.setLineDash([]);
    }

    const startRect = sectionsMap.output[outputId].getBoundingClientRect();
    for(const inputId of sectionsMap.connections[outputId]) {
      if(sectionsMap.input[inputId] === null || sectionsMap.input[inputId] === undefined) continue;

      const endRect = sectionsMap.input[inputId].getBoundingClientRect();
      const outputPos : CoordinateInfo = {
        x: startRect.x + startRect.width/2 - canvasOffset.x,
        y: startRect.y + startRect.height/2 - canvasOffset.y,
      };
      const inputPos : CoordinateInfo = {
        x: endRect.x + endRect.width/2 - canvasOffset.x,
        y: endRect.y + endRect.height/2 - canvasOffset.y,
      };

      if(extraInfo?.cutting) {
        const cuttingInfo = extraInfo.cutting;
        const nominator1 = (outputPos.x-inputPos.x)*(inputPos.y-cuttingInfo.y+canvasOffset.y);
        const nominator2 = (inputPos.x-cuttingInfo.x+canvasOffset.x)*(outputPos.y - inputPos.y);
        const denominator = Math.sqrt((outputPos.x-inputPos.x)**2 + (outputPos.y-inputPos.y)**2);
        const dist = Math.abs(nominator1 - nominator2)/denominator;
        if(dist < 15) {
          linesToCut.push(inputId);
          canvasContext.shadowBlur = 5;
        } else canvasContext.shadowBlur = 0;
      }

      canvasContext.beginPath();
      canvasContext.moveTo(outputPos.x, outputPos.y);
      canvasContext.bezierCurveTo(
        outputPos.x+60*env.scale, outputPos.y,
        inputPos.x-60*env.scale, inputPos.y,
        inputPos.x, inputPos.y,
      );
      canvasContext.stroke();
    }
  }

  canvasContext.strokeStyle = "#dddddd";
  if(extraInfo?.cursor) {
    canvasContext.strokeStyle = "#4086f7";

    const targetPos = extraInfo.cursor;
    const originRect = sectionsMap.activeLinkingOrigin.getBoundingClientRect();
    const origin = {
      x: originRect.x + originRect.width/2 - canvasOffset.x,
      y: originRect.y + originRect.height/2 - canvasOffset.y,
    };

    canvasContext.beginPath();
    canvasContext.moveTo(origin.x, origin.y);
    canvasContext.lineTo(targetPos.x - canvasOffset.x, targetPos.y - canvasOffset.y);
    canvasContext.stroke();
  }
  return linesToCut;
}

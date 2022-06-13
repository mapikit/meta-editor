import type { CoordinateInfo } from "../../common/types/geometry";
import type { EnvType } from "../../stores/environment";
import { sectionsMap } from "./helpers/sections-map";

export type CuttingInfo = {
  mouse : CoordinateInfo;
}

// eslint-disable-next-line max-lines-per-function
export function updateTraces (canvasContext : CanvasRenderingContext2D, env : EnvType, cuttingInfo ?: CuttingInfo)
  : Array<string> {

  const linesToCut : Array<string> = [];
  canvasContext.shadowColor = "red";

  const canvasOffset = canvasContext.canvas.getBoundingClientRect();


  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

  canvasContext.shadowBlur = 0;

  canvasContext.strokeStyle = "#303030";
  canvasContext.beginPath();
  canvasContext.moveTo(env.origin.x, 0);
  canvasContext.lineTo(env.origin.x, canvasContext.canvas.height);
  canvasContext.moveTo(0, env.origin.y);
  canvasContext.lineTo(canvasContext.canvas.width, env.origin.y);
  canvasContext.stroke();

  canvasContext.strokeStyle = "#dddddd";
  canvasContext.lineWidth = 0.6;
  canvasContext.setLineDash([2, 5, 10, 5]);
  canvasContext.beginPath();
  canvasContext.moveTo(canvasContext.canvas.width/2, 0);
  canvasContext.lineTo(canvasContext.canvas.width/2, canvasContext.canvas.height);
  canvasContext.moveTo(0, canvasContext.canvas.height/2);
  canvasContext.lineTo(canvasContext.canvas.width, canvasContext.canvas.height/2);
  canvasContext.stroke();

  canvasContext.setLineDash([]);
  canvasContext.lineWidth = 2;

  for(const outputId of Object.keys(sectionsMap.connections)) {
    if(sectionsMap.output[outputId] === null || sectionsMap.output[outputId] === undefined) continue;
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

      if(cuttingInfo) {
        const nominator1 = (outputPos.x-inputPos.x)*(inputPos.y-cuttingInfo.mouse.y+canvasOffset.y);
        const nominator2 = (inputPos.x-cuttingInfo.mouse.x+canvasOffset.x)*(outputPos.y - inputPos.y);
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
  return linesToCut;
}

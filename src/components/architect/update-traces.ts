import type { Coordinate } from "../../common/types/geometry";
import type { UICompliantBop } from "../../common/types/ui-bop";

export type CuttingInfo = {
  mouse : Coordinate;
}

export function updateTraces (canvasContext : CanvasRenderingContext2D, bop : UICompliantBop, cuttingInfo ?: CuttingInfo) : Array<[number, unknown]> {
  const linesToCut : Array<[number, unknown]> = [];
  canvasContext.shadowColor = "red";


  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
  for(const module of bop.configuration) {
    for(const dependency of module.dependencies) {
      if(dependency.originNob === undefined) continue;
      const startRect = dependency.originNob.getBoundingClientRect();
      const endRect = dependency.targetNob.getBoundingClientRect();
      const outputPos : [number, number] = [startRect.x+startRect.width/2, startRect.y + startRect.height/2];
      const inputPos : [number, number] = [endRect.x+endRect.width/2, endRect.y + endRect.height/2];
      if(cuttingInfo) {
        const nominator1 = (outputPos[0]-inputPos[0])*(inputPos[1]-cuttingInfo.mouse.y);
        const nominator2 = (inputPos[0]-cuttingInfo.mouse.x)*(outputPos[1] - inputPos[1]);
        const denominator = Math.sqrt((outputPos[0]-inputPos[0])**2 + (outputPos[1]-inputPos[1])**2);
        const dist = Math.abs(nominator1 - nominator2)/denominator;
        if(dist < 15) {
          linesToCut.push([module.key, dependency]);
          canvasContext.shadowBlur = 5;
        } else canvasContext.shadowBlur = 0;
      }

      canvasContext.strokeStyle = dependency.matchingType ? "#ffffff" : "#fde072";

      canvasContext.beginPath();
      canvasContext.moveTo(...outputPos);
      canvasContext.bezierCurveTo(
        outputPos[0]+60, outputPos[1],
        inputPos[0]-60, inputPos[1],
        ...inputPos);

      canvasContext.stroke();
    }
  }
  return linesToCut;
}

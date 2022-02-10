import type { UICompliantBop } from "../../common/types/ui-bop";

export function updateTraces (canvasContext : CanvasRenderingContext2D, bop : UICompliantBop) : void {
  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
  for(const module of bop.configuration) {
    for(const dependency of module.dependencies) {
      const startRect = dependency.originNob.getBoundingClientRect();
      const endRect = dependency.targetNob.getBoundingClientRect();
      const outputPos : [number, number] = [startRect.x+startRect.width/2, startRect.y + startRect.height/2]; 
      const inputPos : [number, number] = [endRect.x+endRect.width/2, endRect.y + endRect.height/2]
      canvasContext.strokeStyle = dependency.matchingType ? "#ffffff" : "#fde072"

      canvasContext.beginPath()
      canvasContext.moveTo(...outputPos)
      canvasContext.bezierCurveTo(
        outputPos[0]+60, outputPos[1],
        inputPos[0]-60, inputPos[1],
        ...inputPos)

      canvasContext.stroke()
    }
  }
}
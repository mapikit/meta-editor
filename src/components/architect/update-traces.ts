import { moduleConnections } from "../../stores/connection-stores";


export function updateTraces (canvasContext : CanvasRenderingContext2D, height : number, width : number) : void {
  canvasContext.clearRect(0, 0, width, height);
  for(const connection of Object.values(moduleConnections)) {
    const startRect = connection[0].getBoundingClientRect();
    const endRect = connection[1].getBoundingClientRect();
    const outputPos : [number, number] = [startRect.x+startRect.width/2, startRect.y + startRect.height/2]; 
    const inputPos : [number, number] = [endRect.x+endRect.width/2, endRect.y + endRect.height/2]
    
    
    canvasContext.beginPath()
    canvasContext.moveTo(...outputPos)
    canvasContext.bezierCurveTo(
      outputPos[0]+60, outputPos[1],
      inputPos[0]-60, inputPos[1],
      ...inputPos)

    canvasContext.stroke()
  }
}
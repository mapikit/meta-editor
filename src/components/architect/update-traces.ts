import type { CoordinateInfo } from "../../common/types/geometry";
import { sectionsMap } from "./helpers/sections-map";
import { environment, EnvType } from "../../stores/environment";
import { get } from "svelte/store";


export type ExtraTracingInfo = {
  cutting ?: MouseEvent;
  cursor ?: { x : number, y : number };
}



// eslint-disable-next-line max-lines-per-function
export function updateTraces (extraInfo ?: ExtraTracingInfo) : Array<string> {

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
    if(!sectionsMap.output[outputId]) continue;
    if(outputId.split(".")[1] === "module") {
      canvasContext.strokeStyle = "#dddd22";
      canvasContext.setLineDash(moduleDash);
    } else {
      canvasContext.strokeStyle = "#dddddd";
      canvasContext.setLineDash([]);
    }

    const startRect = sectionsMap.output[outputId].getBoundingClientRect();
    for(const inputId of sectionsMap.connections[outputId]) {
      if(!sectionsMap.input[inputId]) continue;

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

  if(env.functionalTraces || sectionsMap.hoveredFunctionalKnob.length > 0) {
    drawFunctionalConnections(env, canvasOffset, extraInfo?.cutting, linesToCut, sectionsMap.hoveredFunctionalKnob);
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
  // console.log(linesToCut);
  return linesToCut;
}

// eslint-disable-next-line max-params, max-lines-per-function
function drawFunctionalConnections (
  env : EnvType, canvasOffset : DOMRect,
  cuttingInfo : MouseEvent,
  linesToCut : Array<string>,
  hoveredIds ?: string[]) : void {

  env.canvasContext.strokeStyle = "#cc2222";
  env.canvasContext.setLineDash([]);
  for(const moduleKnobId of Object.keys(sectionsMap.functionalConnections)) {
    if(sectionsMap.output[moduleKnobId] === undefined || sectionsMap.output[moduleKnobId] === null) continue;
    const origin = sectionsMap.module[moduleKnobId].getBoundingClientRect();

    for(const functionalId of sectionsMap.functionalConnections[moduleKnobId]) {
      if(sectionsMap.functional[functionalId] === undefined || sectionsMap.functional[functionalId] === null) continue;
      if(!hoveredIds.includes(functionalId) && !env.functionalTraces) continue;
      const target = sectionsMap.functional[functionalId].getBoundingClientRect();

      const outputPos : CoordinateInfo = {
        x: origin.x + origin.width/2 - canvasOffset.x,
        y: origin.y + origin.height/2 - canvasOffset.y,
      };
      const inputPos : CoordinateInfo = {
        x: target.x + target.width/2 - canvasOffset.x,
        y: target.y + target.height/2 - canvasOffset.y,
      };

      if(cuttingInfo) {
        const nominator1 = (outputPos.x-inputPos.x)*(inputPos.y-cuttingInfo.y+canvasOffset.y);
        const nominator2 = (inputPos.x-cuttingInfo.x+canvasOffset.x)*(outputPos.y - inputPos.y);
        const denominator = Math.sqrt((outputPos.x-inputPos.x)**2 + (outputPos.y-inputPos.y)**2);
        const dist = Math.abs(nominator1 - nominator2)/denominator;
        if(dist < 15) {
          // moduleKnobId pattern is `key.module`
          // functional id is `key.`
          linesToCut.push((moduleKnobId.replace(".module","_") + functionalId));
          env.canvasContext.shadowBlur = 5;
        } else env.canvasContext.shadowBlur = 0;
      }

      env.canvasContext.beginPath();
      env.canvasContext.moveTo(outputPos.x, outputPos.y);
      env.canvasContext.bezierCurveTo(
        outputPos.x+60*env.scale, outputPos.y,
        inputPos.x-60*env.scale, inputPos.y,
        inputPos.x, inputPos.y,
      );
      env.canvasContext.stroke();
    }
  }
}


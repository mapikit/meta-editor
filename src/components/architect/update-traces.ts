import type { CoordinateInfo } from "../../common/types/geometry";
import { connectionsManager } from "./helpers/connections-manager";
import { environment, EnvType } from "../../stores/environment";
import type { DrawableConnection } from "./helpers/module-connection";
import { get } from "svelte/store";

export type ExtraTracingInfo = {
  cutting ?: MouseEvent;
  cursor ?: { x : number, y : number };
}

// TODO: Make a function to detect cutting
// Partial implementation here:
//     if(cutting) {
//       const cuttingInfo = cutting;
//       const nominator1 = (outputPos.x-inputPos.x)*(inputPos.y-cuttingInfo.y+canvasOffset.y);
//       const nominator2 = (inputPos.x-cuttingInfo.x+canvasOffset.x)*(outputPos.y - inputPos.y);
//       const denominator = Math.sqrt((outputPos.x-inputPos.x)**2 + (outputPos.y-inputPos.y)**2);
//       const dist = Math.abs(nominator1 - nominator2)/denominator;
//       if(dist < 15) {
//         linesToCut.push(inputId);
//         canvasContext.shadowBlur = 5;
//       } else canvasContext.shadowBlur = 0;
//     }

function applyOffset (canvasDom : DOMRect, connection : DrawableConnection) : DrawableConnection {
  return { ...connection,
    endCoords: { x: connection.endCoords.x - canvasDom.x, y: connection.endCoords.y - canvasDom.y },
    startCoords: { x: connection.startCoords.x - canvasDom.x, y: connection.startCoords.y - canvasDom.y },
  };
};

// eslint-disable-next-line max-lines-per-function
export function updateTraces (additionalDrawables : DrawableConnection[]) : Array<string> {
  console.log("i'm being called");

  const env = get(environment);
  const canvasContext = env.canvasContext;
  const moduleDash = [10, 4, 2, 4].map(value => value*env.scale);

  const canvasOffset = canvasContext.canvas.getBoundingClientRect();

  canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);

  canvasContext.strokeStyle = "#303030";
  canvasContext.setLineDash(moduleDash);
  canvasContext.beginPath();
  canvasContext.moveTo(env.origin.x, 0);
  canvasContext.lineTo(env.origin.x, canvasContext.canvas.height);
  canvasContext.moveTo(0, env.origin.y);
  canvasContext.lineTo(canvasContext.canvas.width, env.origin.y);
  canvasContext.stroke();

  connectionsManager.getVisibleConnections().forEach((connection) => {
    const usedConnection = applyOffset(canvasOffset, connection);

    canvasContext.setLineDash(connection.strokeStyle.dash);
    canvasContext.strokeStyle = connection.strokeStyle.stroke;
    canvasContext.lineWidth = connection.strokeStyle.thickness ?? 2;
    canvasContext.beginPath();
    canvasContext.moveTo(usedConnection.startCoords.x, usedConnection.startCoords.y);
    canvasContext.bezierCurveTo(
      usedConnection.startCoords.x+60*env.scale, usedConnection.startCoords.y,
      usedConnection.endCoords.x-60*env.scale, usedConnection.endCoords.y,
      usedConnection.endCoords.x, usedConnection.endCoords.y,
    );
    canvasContext.stroke();
  });

  return [];


  // for(const outputId of Object.keys(connectionsManager.connections)) {
  //   if(!connectionsManager.output[outputId]) continue;
  //   if(outputId.split(".")[1] === "module") {
  //     canvasContext.strokeStyle = "#dddd22";
  //     canvasContext.setLineDash(moduleDash);
  //   } else {
  //     canvasContext.strokeStyle = "#dddddd";
  //     canvasContext.setLineDash([]);
  //   }

  //   const startRect = connectionsManager.output[outputId].getBoundingClientRect();
  //   for(const inputId of connectionsManager.connections[outputId]) {
  //     if(!connectionsManager.input[inputId]) continue;

  //     const endRect = connectionsManager.input[inputId].getBoundingClientRect();
  //     const outputPos : CoordinateInfo = {
  //       x: startRect.x + startRect.width/2 - canvasOffset.x,
  //       y: startRect.y + startRect.height/2 - canvasOffset.y,
  //     };
  //     const inputPos : CoordinateInfo = {
  //       x: endRect.x + endRect.width/2 - canvasOffset.x,
  //       y: endRect.y + endRect.height/2 - canvasOffset.y,
  //     };

  //     if(extraInfo?.cutting) {
  //       const cuttingInfo = extraInfo.cutting;
  //       const nominator1 = (outputPos.x-inputPos.x)*(inputPos.y-cuttingInfo.y+canvasOffset.y);
  //       const nominator2 = (inputPos.x-cuttingInfo.x+canvasOffset.x)*(outputPos.y - inputPos.y);
  //       const denominator = Math.sqrt((outputPos.x-inputPos.x)**2 + (outputPos.y-inputPos.y)**2);
  //       const dist = Math.abs(nominator1 - nominator2)/denominator;
  //       if(dist < 15) {
  //         linesToCut.push(inputId);
  //         canvasContext.shadowBlur = 5;
  //       } else canvasContext.shadowBlur = 0;
  //     }

  //     canvasContext.beginPath();
  //     canvasContext.moveTo(outputPos.x, outputPos.y);
  //     canvasContext.bezierCurveTo(
  //       outputPos.x+60*env.scale, outputPos.y,
  //       inputPos.x-60*env.scale, inputPos.y,
  //       inputPos.x, inputPos.y,
  //     );
  //     canvasContext.stroke();
  //   }
  // }

  // if(env.functionalTraces || connectionsManager.hoveredFunctionalKnob.length > 0) {
  //   drawFunctionalConnections(env, canvasOffset, extraInfo?.cutting, linesToCut, connectionsManager.hoveredFunctionalKnob);
  // }

  // canvasContext.strokeStyle = "#dddddd";
  // if(extraInfo?.cursor) {
  //   canvasContext.strokeStyle = "#4086f7";

  //   const targetPos = extraInfo.cursor;
  //   const originRect = connectionsManager.activeLinkingOrigin.getBoundingClientRect();
  //   const origin = {
  //     x: originRect.x + originRect.width/2 - canvasOffset.x,
  //     y: originRect.y + originRect.height/2 - canvasOffset.y,
  //   };

  //   canvasContext.beginPath();
  //   canvasContext.moveTo(origin.x, origin.y);
  //   canvasContext.lineTo(targetPos.x - canvasOffset.x, targetPos.y - canvasOffset.y);
  //   canvasContext.stroke();
  // }
  // // console.log(linesToCut);
  // return linesToCut;
}

// eslint-disable-next-line max-params, max-lines-per-function
function drawFunctionalConnections (
  env : EnvType, canvasOffset : DOMRect,
  cuttingInfo : MouseEvent,
  linesToCut : Array<string>,
  hoveredIds ?: string[]) : void {

  env.canvasContext.strokeStyle = "#cc2222";
  env.canvasContext.setLineDash([]);
  for(const moduleKnobId of Object.keys(connectionsManager.functionalConnections)) {
    if(connectionsManager.output[moduleKnobId] === undefined || connectionsManager.output[moduleKnobId] === null) continue;
    const origin = connectionsManager.module[moduleKnobId].getBoundingClientRect();

    for(const functionalId of connectionsManager.functionalConnections[moduleKnobId]) {
      if(connectionsManager.functional[functionalId] === undefined || connectionsManager.functional[functionalId] === null) continue;
      if(!hoveredIds.includes(functionalId) && !env.functionalTraces) continue;
      const target = connectionsManager.functional[functionalId].getBoundingClientRect();

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


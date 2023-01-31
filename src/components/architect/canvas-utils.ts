import type { Coordinate, CoordinateInfo } from "../../common/types/geometry";
import { connectionsManager } from "./helpers/connections-manager";
import type { DrawableConnection, ModuleConnection } from "./helpers/module-connection";
import { get, Writable } from "svelte/store";

export class CanvasUtils {
  public canvasContext : CanvasRenderingContext2D;

  public constructor (
    public readonly scale : Writable<number>,
    public readonly origin : Writable<Coordinate>,
  ) {
    this.drawConnection = this.drawConnection.bind(this);
    this.drawStraight = this.drawStraight.bind(this);
    this.redrawConnections = this.redrawConnections.bind(this);
    this.applyOffset = this.applyOffset.bind(this);
  }

  public get canvasDOMRect () : DOMRect {
    if (!this.canvasContext) return undefined;
    return this.canvasContext.canvas.getBoundingClientRect();
  }

  private get readScale () : number {
    return get(this.scale);
  }

  private get readCoords () : Coordinate {
    return get(this.origin);
  }

  public drawConnection (connection : DrawableConnection) : void {
    if (!this.canvasContext) return undefined;
    const usedConnection = this.applyOffset(connection);

    this.canvasContext.setLineDash(connection.strokeStyle.dash);
    this.canvasContext.strokeStyle = connection.strokeStyle.stroke;
    this.canvasContext.lineWidth = connection.strokeStyle.thickness ?? 2;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(usedConnection.startCoords.x, usedConnection.startCoords.y);
    this.canvasContext.bezierCurveTo(
      usedConnection.startCoords.x+60*this.readScale, usedConnection.startCoords.y,
      usedConnection.endCoords.x-60*this.readScale, usedConnection.endCoords.y,
      usedConnection.endCoords.x, usedConnection.endCoords.y,
    );
    this.canvasContext.stroke();
  }

  public drawStraight (connection : DrawableConnection) : void {
    if (!this.canvasContext) return undefined;
    const usedConnection = this.applyOffset(connection);

    this.canvasContext.setLineDash(connection.strokeStyle.dash);
    this.canvasContext.strokeStyle = connection.strokeStyle.stroke;
    this.canvasContext.lineWidth = connection.strokeStyle.thickness ?? 2;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(usedConnection.startCoords.x, usedConnection.startCoords.y);
    this.canvasContext.lineTo(usedConnection.endCoords.x, usedConnection.endCoords.y);
    this.canvasContext.stroke();
  }

  private applyOffset (connection : DrawableConnection) : DrawableConnection {
    if (!this.canvasContext) return undefined;
    return { ...connection,
      endCoords: { x: connection.endCoords.x - this.canvasDOMRect.x, y: connection.endCoords.y - this.canvasDOMRect.y },
      startCoords: {
        x: connection.startCoords.x - this.canvasDOMRect.x, y: connection.startCoords.y - this.canvasDOMRect.y,
      },
    };
  }

  // eslint-disable-next-line max-lines-per-function
  public redrawConnections (additionalLineDrawables : DrawableConnection[] = [],
    additionalBezierDrawables : DrawableConnection[] = [],
  ) : void {
    if (!this.canvasContext) return undefined;
    const moduleDash = [10, 4, 2, 4].map(value => value*this.readScale);

    this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);

    this.canvasContext.strokeStyle = "#ffffff30";
    this.canvasContext.setLineDash(moduleDash);
    this.canvasContext.lineWidth = 2;
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(this.readCoords.x, 0);
    this.canvasContext.lineTo(this.readCoords.x, this.canvasContext.canvas.height);
    this.canvasContext.moveTo(0, this.readCoords.y);
    this.canvasContext.lineTo(this.canvasContext.canvas.width, this.readCoords.y);
    this.canvasContext.stroke();

    connectionsManager.getVisibleConnections().forEach(this.drawConnection);
    additionalLineDrawables.forEach(this.drawStraight);
    additionalBezierDrawables.forEach(this.drawConnection);
  };

  // eslint-disable-next-line max-lines-per-function
  public getInCuttingRange (connections : ModuleConnection[], cursorPosition : CoordinateInfo) : ModuleConnection[] {
    if (!this.canvasContext) return undefined;
    const result = [];

    connections.forEach((connection) => {
      if (!connection.canBeDrawn) { return; }
      const { startCoords, endCoords } = connection.getDrawable();
      const startCoordsCp = { x: startCoords.x+60*this.readScale, y: startCoords.y };
      const endCoordsCp = { x: endCoords.x-60*this.readScale, y: endCoords.y };

      const distance = getMinimumDistanceFromCurve(cursorPosition, startCoords, startCoordsCp, endCoordsCp, endCoords);

      if (distance < 15) {
        result.push(connection);
      }
    });

    return result;
  }
}

// Thanks Chat GPT
const getBezierPoint = (t, startPoint, cp1, cp2, endPoint) : CoordinateInfo => {
  // eslint-disable-next-line max-len
  const x = (1 - t) * (1 - t) * (1 - t) * startPoint.x + 3 * (1 - t) * (1 - t) * t * cp1.x + 3 * (1 - t) * t * t * cp2.x + t * t * t * endPoint.x;
  // eslint-disable-next-line max-len
  const y = (1 - t) * (1 - t) * (1 - t) * startPoint.y + 3 * (1 - t) * (1 - t) * t * cp1.y + 3 * (1 - t) * t * t * cp2.y + t * t * t * endPoint.y;
  return { x, y };
};

// Squared for efficiency reasons, no need to get the root right now
const getDistance = (pointA : CoordinateInfo, pointB : CoordinateInfo) : number => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return dx * dx + dy * dy;
};

// eslint-disable-next-line max-lines-per-function
const getMinimumDistanceFromCurve = (
  point : CoordinateInfo,
  startPoint : CoordinateInfo,
  controlPoint1 : CoordinateInfo,
  controlPoint2 : CoordinateInfo,
  endPoint : CoordinateInfo) : number => {
  let minDist = Infinity;
  for (let t = 0; t <= 1; t += 0.01) {
    const p = getBezierPoint(t, startPoint, controlPoint1, controlPoint2, endPoint);
    const dist = getDistance(point, p);
    if (dist < minDist) {
      minDist = dist;
    }
  }

  const distance = Math.sqrt(minDist);
  return distance;
};

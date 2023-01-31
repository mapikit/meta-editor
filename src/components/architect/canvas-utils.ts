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

      const nominator1 = (endCoords.x-startCoords.x)*(startCoords.y-cursorPosition.y+this.canvasDOMRect.y);
      const nominator2 = (startCoords.x-cursorPosition.x+this.canvasDOMRect.x)*(endCoords.y - startCoords.y);
      const denominator = Math.sqrt((endCoords.x-startCoords.x)**2 + (endCoords.y-startCoords.y)**2);
      const dist = Math.abs(nominator1 - nominator2)/denominator;

      if(dist < 15) {
        result.push(connection);
      }
    });

    return result;
  }
}

export type Geometry = {
  position : Coordinate;
  dimensions : Dimensions;
}

export interface CoordinateInfo {
  x : number;
  y : number;
}

export class Coordinate  implements CoordinateInfo {
  constructor (
    public x : number,
    public y : number,
  ) { }

  /**
   * Returns a cardinal vector (x, y) to the targetPoint.
   * @param targetPoint
   * @returns
   */
  public newPointer (targetPoint : Coordinate) : Coordinate {
    return new Coordinate(
      targetPoint.x - this.x,
      targetPoint.y - this.y,
    );
  }

  public scale (scale : number) : Coordinate {
    this.x *= scale;
    this.y *= scale;
    return this;
  }

  public moveTo (x : number, y : number) : Coordinate {
    this.x = x;
    this.y = y;
    return this;
  }

  public moveBy (x : number, y ?: number) : Coordinate {
    this.x += x;
    this.y += y;
    return this;
  }

  public decompose () : [number, number] {
    return [this.x, this.y];
  }

  public static nullable () : Coordinate {
    return new Coordinate(null, null);
  }

  public isNullable () : boolean {
    return this.x === null || this.y === null;
  }

  public getDistanceTo (coordinate : Coordinate) : number {
    if (this.isNullable() || coordinate.isNullable()) { return 0; }

    const xDistance = Math.abs(coordinate.x - this.x);
    const yDistance = Math.abs(coordinate.y - this.y);

    return Math.sqrt(xDistance^2 + yDistance^2);
  }
}

export type Dimensions = {
  height : number;
  width : number;
}

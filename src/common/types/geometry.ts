export type Geometry = {
  position: Coordinate;
  dimensions: Dimensions;
}

export type Coordinate = {
  x: number;
  y: number;
}

export type Dimensions = {
  height: number;
  width: number;
}
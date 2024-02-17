export class AdvancedMath {
  public static round (value : number, precision = 1) : number {
    const division = Math.round(value/precision);
    return division*precision;
  }
}

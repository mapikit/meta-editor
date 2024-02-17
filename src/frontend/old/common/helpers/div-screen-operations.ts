type ScreenBoundary = {
  left : number;
  right : number;
}

export class DivScreenOperations {
  public static isElementInViewport (element : HTMLElement) : boolean {
    if(!element) { return false; }
    const rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= DivScreenOperations.getViewportHeight() &&
      rect.right <= DivScreenOperations.getViewportWidth()
    );
  }

  public static getViewportHeight () : number {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  public static getViewportWidth () : number {
    return window.innerWidth || document.documentElement.clientWidth;
  }

  public static getScreenBoundary () : ScreenBoundary {
    return {
      left: this.getViewportWidth(),
      right: this.getViewportHeight(),
    };
  }

  public static extractValue (styleNumericProp : string) : [number, string] {
    const formatChars = [];
    let finalNumberIndex = styleNumericProp.length -1;
    for (let charPos = styleNumericProp.length -1; charPos >= 0; charPos --) {
      if (Number.isNaN(Number(styleNumericProp.charAt(charPos)))) {
        formatChars.unshift(styleNumericProp.charAt(charPos));
        finalNumberIndex --;
        continue;
      } else {
        break;
      }
    }

    return [Number(styleNumericProp.slice(0, finalNumberIndex)) ?? 0, formatChars.join("")];
  }
}

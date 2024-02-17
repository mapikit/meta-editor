export class PathUtils {
  // eslint-disable-next-line max-lines-per-function
  public static getSteps (path : string) : string[] {
    const objSteps = path.split(".");
    const result = [];
    let isFirstStep = true;

    for (const step of objSteps) {
      if (step.includes("[")) {
        const arrayStartIndex = step.indexOf("[");
        const arrayEndIndex = step.indexOf("]");

        result.push(`.${step.substring(0, arrayStartIndex)}`);
        result.push(step.substring(arrayStartIndex, arrayEndIndex + 1));
        continue;
      }

      result.push(isFirstStep ? step : `.${step}`);
      isFirstStep = false;
    }

    return result;
  }
}

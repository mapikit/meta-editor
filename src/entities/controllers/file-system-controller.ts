import { FSProjectFunctions } from "./file-system-controller-functions/projects.js";
import { FSVersionsFunctions } from "./file-system-controller-functions/versions.js";

export class FileSystemController {
  public static projects = FSProjectFunctions;
  public static versions = FSVersionsFunctions;
}

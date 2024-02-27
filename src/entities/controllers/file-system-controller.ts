import { FSArchiveFunctions } from "./file-system-controller-functions/archive.js";
import { FSCreateFunctions } from "./file-system-controller-functions/update.js";
import { FSDeleteFunctions } from "./file-system-controller-functions/delete.js";
import { FSReadFunctions } from "./file-system-controller-functions/load.js";

export class FileSystemController {
  public static load = FSReadFunctions;
  public static update = FSCreateFunctions;
  public static delete = FSDeleteFunctions;
  public static archive = FSArchiveFunctions;


  // Aliases Section
  public static create = this.update;
}

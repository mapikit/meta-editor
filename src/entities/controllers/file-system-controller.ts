import { ProjectsFileSystemController } from "./file-system-controller-functions/projects.js";
import { ConfigurationFileSystemController } from "./file-system-controller-functions/versions.js";

export class FileSystemController {
  public static projectsController = ProjectsFileSystemController;
  public static configurationsController = ConfigurationFileSystemController;
}

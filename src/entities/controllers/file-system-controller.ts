import { ProjectsFileSystemController } from "./file-system-controller-functions/projects.js";
import { VersionsFileSystemController } from "./file-system-controller-functions/versions.js";

export class FileSystemController {
  public static projectsController = ProjectsFileSystemController;
  public static versionsController = VersionsFileSystemController;
}

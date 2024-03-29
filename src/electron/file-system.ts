import electron from "electron";
const { app } = electron;
import path from "path";
import fs from "fs";
import type { MetaEditorInfoType } from "../common/types/meta-editor-info";
import type { UserConfigType } from "src/common/types/user-config";
import type { ProjectConfigType } from "../common/types/project-config-type";
import type { ConfigurationType } from "meta-system";

/**
 * Exposes a method to the electron renderer. Will be available through window.fileApi
 *
 * Simply add `@expose` above the method name.
 *
 *
 * Ex:
 * @expose
 * ```
 * public static myMethod (args : any) : void {}
 * ```
 */
function expose (target : unknown, key : string) : void {
  target["exposed"] = target["exposed"] ? [...target["exposed"], key] : [key];
}


export class ElectronFileSystem {
  private static get appPath () : string {
    const mode = process.env.NODE_ENV;
    if(mode === "production") return app.getPath("sessionData"); //equal to: %appdata%/meta-editor/
    else return path.join(process.cwd(), "test-files");
  }

  private static get savaDataPath () : string { return path.join(this.appPath, "save-data"); }
  private static get projectsDirPath () : string { return path.join(this.savaDataPath, "projects"); }
  private static get userConfigPath () : string { return path.join(this.savaDataPath, "user-config.json"); }

  private static getProjectDirPath (projectName : string) : string {
    return path.join(this.projectsDirPath, projectName);
  }

  private static getProjectConfigPath (projectName : string) : string {
    return path.join(this.getProjectDirPath(projectName), "project-config.json");
  }

  private static getVersionDirPath (projectName : string, version : string) : string {
    return path.join(this.getProjectDirPath(projectName), "versions", version);
  }

  private static getVersionConfigPath (projectName : string, version : string) : string {
    return path.join(this.getVersionDirPath(projectName, version), "config.json");
  }

  @expose
  static saveVersion (project : ProjectConfigType, config : ConfigurationType, editor : MetaEditorInfoType) : void {
    const projectDir = this.getProjectDirPath(project.projectName);
    const proposedVersionDir = this.decideVersionDir(project, config.version);
    const versionPath = path.isAbsolute(proposedVersionDir) ?
      proposedVersionDir : path.join(projectDir, proposedVersionDir, "config.json");
    const versionDir = path.parse(versionPath).dir;

    this.saveFileData(this.getProjectConfigPath(project.projectName), project);
    this.saveFileData(versionPath, config);
    this.saveMetaEditorInfo(versionDir, editor);
  }

  @expose
  static saveMetaEditorInfo (versionDirPath : string, metaEditorInfo : MetaEditorInfoType) : void {
    const metaEditorInfoDir = path.join(versionDirPath, ".meta-editor");
    fs.mkdirSync(metaEditorInfoDir, { recursive: true });

    for(const key of Object.keys(metaEditorInfo)) {
      const propertyPath = path.join(metaEditorInfoDir, key+".json");
      fs.writeFileSync(propertyPath, JSON.stringify(metaEditorInfo[key], undefined, 4));
    }
  }

  private static decideVersionDir (projectConfig : ProjectConfigType, version : string) : string {
    let versionInfoIndex = projectConfig.versions.findIndex(_version => _version.version === version);
    if(versionInfoIndex === -1) {
      const projectDirPath = this.getProjectDirPath(projectConfig.projectName);
      const versionPath = this.getVersionDirPath(projectConfig.projectName, version);
      const relativePath = path.relative(projectDirPath, versionPath);
      const date = new Date().toISOString();

      projectConfig.versions.push({ createdAt: date, updatedAt: date,
        version: version,
        path: relativePath,
      });
      versionInfoIndex = projectConfig.versions.length - 1;
    }

    return projectConfig.versions[versionInfoIndex].path;
  }

  private static saveFileData (filePath : string, data : string | object) : void {
    const dir = path.parse(filePath).dir;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, typeof data === "string" ?
      data : JSON.stringify(data, undefined, 4));
  }

  @expose
  static saveUserInfo (userConfig : UserConfigType) : void {
    this.saveFileData(this.userConfigPath, userConfig);
  }

  @expose
  static saveProjectInfo (project : ProjectConfigType) : void {
    const projectConfig = this.getProjectConfigPath(project.projectName);

    this.saveFileData(projectConfig, project);
  }

  @expose
  static getUserConfig () : UserConfigType {
    const userConfigPath = this.userConfigPath;
    if(!fs.existsSync(userConfigPath)) return undefined;
    return JSON.parse(fs.readFileSync(this.userConfigPath).toString());
  }

  @expose
  static getAvailableProjects () : string[] {
    const projectsPath = this.projectsDirPath;
    if(!fs.existsSync(projectsPath)) return [];
    return fs.readdirSync(this.projectsDirPath);
  }

  @expose
  static getProjectInfo (projectName : string) : ProjectConfigType {
    const projectPath = this.getProjectConfigPath(projectName);
    if(!fs.existsSync(projectPath)) return undefined;
    return JSON.parse(fs.readFileSync(projectPath).toString());
  }

  @expose
  static getVersion (projectName : string, version : string) : ConfigurationType {
    const prj = this.getProjectInfo(projectName);
    this.decideVersionDir(prj, version);
    const versionPath = this.getVersionConfigPath(projectName, version);
    if(!fs.existsSync(versionPath)) return undefined;
    return JSON.parse(fs.readFileSync(versionPath).toString());
  }

  @expose
  static deleteVersion (projectInfo : ProjectConfigType, version : string) : void {
    const projectDirPath = this.getProjectDirPath(projectInfo.projectName);
    const versionDir = this.decideVersionDir(projectInfo, version);
    fs.rmSync(path.join(projectDirPath, versionDir), { recursive: true });

    const projectConfigPath = this.getProjectConfigPath(projectInfo.projectName);
    projectInfo.versions = projectInfo.versions.filter(_version => _version.version !== version);
    this.saveFileData(projectConfigPath, projectInfo);
  }
}

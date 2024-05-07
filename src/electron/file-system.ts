import electron from "electron";
const { app } = electron;
import path from "path";
import fs from "fs";
import type { MetaEditorInfoType } from "../common/types/meta-editor-info";
import type { UserConfigType } from "../common/types/serializables/user-config";
import type { ProjectConfigType } from "../common/types/serializables/project-config-type";
import type { ConfigurationType } from "meta-system";
import { nanoid } from "nanoid";
import { Serializable } from "../common/types/serializable";
import { SerializableEditorMetadata } from "../common/types/serializables/serialized-editor-metadata";

/**
 * Exposes a method to the electron renderer. Will be available through window.fileApi
 *
 * Simply add `@exposeInWindow` above the method name.
 *
 * Ex:
 * @expose
 * ```
 * public static myMethod (args : any) : void {}
 * ```
 */
function exposeInWindow (target : unknown, key : string) : void {
  target["exposed"] = target["exposed"] ? [...target["exposed"], key] : [key];
}


export class ElectronFileSystem {
  private static get appPath () : string {
    const mode = process.env.NODE_ENV;
    if(mode === "production") return app.getPath("sessionData"); //equal to: %appdata%/meta-editor/
    else return path.join(process.cwd(), "test-files");
  }

  private static get saveDataPath () : string { return path.join(this.appPath, "save-data"); }
  private static get userConfigPath () : string { return path.join(this.saveDataPath, "user-config.json"); }
  private static get editorMetadataConfigPath () : string { return path.join(this.appPath, "editor-metadata.json"); }
  private static get projectsDirPath () : string { return path.join(this.saveDataPath, "projects"); }
  private static get projectArchivePath () : string { return path.join(this.appPath, "archive/projects/"); }
  private static get versionArchivePath () : string { return path.join(this.appPath, "archive/versions/"); }


  private static getProjectDirPath (projectIdentifier : string) : string {
    return path.join(this.projectsDirPath, projectIdentifier);
  }

  private static getProjectConfigPath (projectIdentifier : string) : string {
    return path.join(this.getProjectDirPath(projectIdentifier), "project-config.json");
  }

  private static getVersionDirPath (projectIdentifier : string, version : string) : string {
    return path.join(this.getProjectDirPath(projectIdentifier), "versions", version);
  }

  private static getVersionConfigPath (projectIdentifier : string, version : string) : string {
    return path.join(this.getVersionDirPath(projectIdentifier, version), "config.json");
  }

  @exposeInWindow
  static async saveVersion (project : ProjectConfigType, config : ConfigurationType, editor : MetaEditorInfoType)
    : Promise<void> {
    const projectDir = this.getProjectDirPath(project.identifier);
    const proposedVersionDir = this.decideVersionDir(project, config.version);
    const versionPath = path.isAbsolute(proposedVersionDir) ?
      proposedVersionDir : path.join(projectDir, proposedVersionDir, "config.json");
    const versionDir = path.parse(versionPath).dir;

    await this.saveFileData(this.getProjectConfigPath(project.identifier), project);
    await this.saveFileData(versionPath, config);
    await this.saveMetaEditorInfo(versionDir, editor);
  }

  @exposeInWindow
  static async saveMetaEditorInfo (versionDirPath : string, metaEditorInfo : MetaEditorInfoType) : Promise<void> {
    const metaEditorInfoDir = path.join(versionDirPath, ".meta-editor");
    await this.createDir(metaEditorInfoDir);

    for(const key of Object.keys(metaEditorInfo)) {
      const propertyPath = path.join(metaEditorInfoDir, key+".json");
      fs.writeFileSync(propertyPath, JSON.stringify(metaEditorInfo[key], undefined, 4));
    }
  }

  // eslint-disable-next-line max-lines-per-function
  private static decideVersionDir (projectConfig : ProjectConfigType, version : string)
    : string {
    let versionInfoIndex = projectConfig.versions.findIndex(_version => _version.version === version);
    if(versionInfoIndex === -1) {
      const projectDirPath = this.getProjectDirPath(projectConfig.identifier);
      const versionPath = this.getVersionDirPath(projectConfig.identifier, version);
      const relativePath = path.relative(projectDirPath, versionPath);
      const date = new Date().toISOString();

      projectConfig.versions.unshift({
        createdAt: date, updatedAt: date,
        version: version,
        path: relativePath,
        identifier: nanoid(),
      });
      versionInfoIndex = 0;
    }

    return projectConfig.versions[versionInfoIndex].path;
  }

  private static async saveFileData (filePath : string, data : string | object) : Promise<void> {
    const dir = path.parse(filePath).dir;
    await this.createDir(dir);
    fs.writeFileSync(filePath, typeof data === "string" ?
      data : JSON.stringify(data, undefined, 4));
  }

  private static async getFileData<T> (filePath : string) : Promise<Serializable<T>> {
    const fileContents = await fs.promises.readFile(filePath);
    return JSON.parse(fileContents.toString()) as Serializable<T>;
  }

  @exposeInWindow
  static async saveUserInfo (userConfig : UserConfigType) : Promise<void> {
    await this.saveFileData(this.userConfigPath, userConfig);
  }

  @exposeInWindow
  static async saveProjectInfo (project : ProjectConfigType) : Promise<void> {
    const projectConfig = this.getProjectConfigPath(project.identifier);

    await this.saveFileData(projectConfig, project);
  }

  @exposeInWindow
  static async getUserConfig () : Promise<UserConfigType> {
    const userConfigPath = this.userConfigPath;
    if(!fs.existsSync(userConfigPath)) return undefined;
    return JSON.parse(fs.readFileSync(this.userConfigPath).toString());
  }

  @exposeInWindow
  static async getProjectInfo (projectIdentifier : string) : Promise<ProjectConfigType> {
    const projectPath = this.getProjectConfigPath(projectIdentifier);
    if(!fs.existsSync(projectPath)) return undefined;
    return JSON.parse(fs.readFileSync(projectPath).toString());
  }

  @exposeInWindow
  static async getVersion (projectIdentifier : string, version : string) : Promise<ConfigurationType> {
    const prj = await this.getProjectInfo(projectIdentifier);
    this.decideVersionDir(prj, version);
    const versionPath = this.getVersionConfigPath(projectIdentifier, version);
    if(!fs.existsSync(versionPath)) return undefined;
    return JSON.parse(fs.readFileSync(versionPath).toString());
  }


  @exposeInWindow
  // TODO change to delete from archive
  static async deleteVersion (projectInfo : ProjectConfigType, version : string) : Promise<void> {
    const projectDirPath = this.getProjectDirPath(projectInfo.identifier);
    const versionDir = this.decideVersionDir(projectInfo, version);
    fs.rmSync(path.join(projectDirPath, versionDir), { recursive: true });

    const projectConfigPath = this.getProjectConfigPath(projectInfo.identifier);
    projectInfo.versions = projectInfo.versions.filter(_version => _version.version !== version);
    await this.saveFileData(projectConfigPath, projectInfo);
  }

  @exposeInWindow
  // TODO change to delete from archive
  static async deleteProject (projectInfo : ProjectConfigType) : Promise<void> {
    const projectDirPath = this.getProjectDirPath(projectInfo.identifier);
    fs.rmSync(path.join(projectDirPath), { recursive: true });
  }

  @exposeInWindow
  static async archiveProject (projectInfo : ProjectConfigType) : Promise<void> {
    const projectDirPath = this.getProjectDirPath(projectInfo.identifier);
    const archive = path.join(this.projectArchivePath, projectInfo.identifier);
    await this.createDir(archive);
    await this.moveDir(projectDirPath, archive);
  }

  @exposeInWindow
  static async archiveVersion (projectInfo : ProjectConfigType, version : string) : Promise<void> {
    const projectDirPath = this.getProjectDirPath(projectInfo.identifier);
    const versionDir = this.decideVersionDir(projectInfo, version);
    const archive = path.join(this.versionArchivePath, projectInfo.identifier, version);
    await this.createDir(archive);
    await this.moveDir(path.join(projectDirPath, versionDir), archive);

    const projectConfigPath = this.getProjectConfigPath(projectInfo.identifier);
    projectInfo.versions = projectInfo.versions.filter(_version => _version.version !== version);
    await this.saveFileData(projectConfigPath, projectInfo);
  }

  @exposeInWindow
  static async fetchEditorMetadata () : Promise<SerializableEditorMetadata> {
    const result = await this.getFileData<SerializableEditorMetadata>(this.editorMetadataConfigPath)
      .catch(() => undefined);

    if (result) {
      return result;
    }

    await this.createEditorMetadata();
    return this.getFileData<SerializableEditorMetadata>(this.editorMetadataConfigPath);
  }

  /** Used for the first load - or when editor is reset */
  @exposeInWindow
  static async createEditorMetadata () : Promise<void> {
    const newEmptySerializable : SerializableEditorMetadata = {
      availableProjectsIds: [],
    };

    return this.saveFileData(this.editorMetadataConfigPath, newEmptySerializable);
  }

  private static async moveDir (src : string, target : string) : Promise<void> {
    try { fs.renameSync(src, target); }
    catch(error) {
      if(error.code === "ENOTEMPTY") { //If unable to move due to directory not being empty
        const innerPaths = fs.readdirSync(src);
        for(const innerPath of innerPaths) await this.moveDir(path.join(src, innerPath), path.join(target, innerPath));
        await this.moveDir(src, target);
      }
    }
  }

  private static async createDir (dirPath : string, optimistic : boolean = true) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.mkdir(dirPath, async (error) => {
        if(!error) resolve();
        else if(error.code === "ENOENT") { // If previous path does not exit
          await this.createDir(path.dirname(dirPath)); // Create previous path (recursive)
          this.createDir(dirPath).then(resolve).catch(reject); // Then create final path
        } else if(error.code === "EEXIST" && optimistic) { // Directory already exists and that's ok :)
          resolve();
        } else reject(error);
      });
    });
  }
}

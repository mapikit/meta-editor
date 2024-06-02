import { nanoid } from "nanoid";
import { EditorEntityValue } from "./editor-entity-value";
import { valid } from "semver";
import { ProjectConfigType, ProjectVersionInfo } from "../../common/types/serializables/project-config-type.js";

export class Project implements EditorEntityValue {
  public projectName : string;
  public description : string;
  public identifier : string = nanoid();
  public versions : ProjectConfigType["versions"];
  public createdAt : Date;
  public updatedAt : Date;

  constructor (projectInfo : ProjectConfigType) {
    this.projectName = projectInfo?.projectName ?? "Unnamed",
    this.description = projectInfo?.description ?? "No description";
    this.createdAt = projectInfo?.createdAt ? new Date(projectInfo.createdAt) : new Date();
    this.updatedAt = projectInfo?.updatedAt ? new Date(projectInfo.updatedAt) : new Date();
    this.versions = projectInfo?.versions ?? [];
    this.identifier = projectInfo.identifier;
  }

  public listVersions () : string[] {
    return this.versions.map(version => version.version);
  }

  public hasVersion (version : string) : boolean {
    return this.versions.find(_version => _version.version == version) !== undefined;
  }

  public removeVersion (version : string) : void {
    const index = this.versions.findIndex(_version => _version.version === version);
    if(index !== -1) this.versions.splice(index, 1);
  }

  public removeVersionById (versionId : string) : void {
    const index = this.versions.findIndex(_version => _version.identifier === versionId);
    if(index !== -1) this.versions.splice(index, 1);
  }

  public addVersion (version : ProjectVersionInfo) : void {
    this.versions.push(version);
  }

  public isVersionValid (version : string) : boolean {
    return valid(version) !== null;
  }

  public getLatestVersionIdentifier () : string {
    const result = [...this.versions];
    result.sort((a, b) => a.updatedAt > b.updatedAt ? 1 : -1);
    return result[0]?.identifier;
  }

  public getVersionNavigationPath (version : string) : string {
    return `/projects/${this.identifier}/versions/${version}`;
  }

  public static getFirstVersionNumber () : string {
    return "0.0.1";
  }

  public toJson () : ProjectConfigType {
    return {
      projectName: this.projectName,
      description: this.description,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      versions: this.versions,
      identifier: this.identifier,
    };
  }

  static newEmptyVersionInfo (version : string) : ProjectVersionInfo {
    const now = new Date(Date.now()).toISOString();
    return {
      updatedAt: now,
      createdAt: now,
      version,
      identifier: nanoid(),
    };
  }

  static newEmpty () : Project {
    return new Project({
      projectName: "New Project",
      description: "Project description",
      identifier: nanoid(),
      versions: [],
      createdAt: new Date(Date.now()).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    });
  }
}

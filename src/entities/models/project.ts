import { nanoid } from "nanoid";
import { EditorEntityValue } from "./editor-entity-value";
import { valid } from "semver";
import { ProjectConfigType, ProjectVersionInfo } from "../../common/types/serializables/project-config-type.js";
import { SystemConfiguration } from "./system-configuration";
import clone from "just-clone";

export class Project implements EditorEntityValue {
  public readonly identifier : string = nanoid();
  public projectName : string;
  public description : string;
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
    this.versions = this.versions.filter(v => v.identifier !== versionId);
  }

  public addVersion (version : ProjectVersionInfo) : void {
    this.versions.push(version);
  }

  public isVersionValid (version : string) : boolean {
    return valid(version) !== null;
  }

  public getLatestVersionIdentifier () : string {
    const result = [...this.versions];
    result.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1);
    return result[0]?.identifier;
  }

  public getVersionNavigationPath (version : string) : string {
    return `/projects/${this.identifier}/versions/${version}`;
  }

  public static getFirstVersionNumber () : string {
    return "0.0.1";
  }

  /** Keeps the same version ID's - you should run .rerollVersionsIds afterwards */
  public cloneToNew () : Project {
    const versionsClone = clone(this.versions);
    const result = new Project({ ...this.toJson(), identifier: nanoid(), versions: versionsClone });
    result.projectName = `${this.projectName} (Clone)`;
    return result;
  }

  /** Changes the versions ID's for the local versions */
  public rerollVersionsIds (systemConfigurations : SystemConfiguration[]) : SystemConfiguration[] {
    const clonedVersions = systemConfigurations.map(sc => {
      const newConfig = new SystemConfiguration({ ...sc.toJson(), identifier: nanoid() }, this.identifier);
      const localVersion = this.versions.find(versionInfo => versionInfo.identifier == sc.identifier);
      localVersion.identifier = newConfig.identifier;

      return newConfig;
    });

    return clonedVersions;
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
      name: "New Version Name",
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

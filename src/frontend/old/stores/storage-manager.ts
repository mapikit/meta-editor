/* eslint-disable max-classes-per-file */

import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";
import { get, Unsubscriber, Writable } from "svelte/store";
import type { PackageInfo } from "../components/modal/package-list-info";
import type { UIBusinessOperation } from "../entities/business-operation";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import type { Protocol } from "../entities/protocol";
import type { Schema } from "../entities/schema";
import type { Serialized } from "../entities/serialized-type";

export interface StorageManagerType {
  getProtocols : (query ?: string) => Promise<Array<PackageInfo<"protocol">>>;
  loginUser : (email : string, password : string) => Promise<void>;
  registerUser : (email : string, password : string) => Promise<void>;
  userExists : (email : string) => Promise<boolean>;
  refreshUserAuth : () => Promise<void>;
  loadProjectsToStores : () => Promise<void>;
  loadVersionsToStores : (projectId : string) => Promise<void>;
  appendVersionsToStores : (projectId : string) => Promise<void>;

  updateProject : (projects : Project) => Promise<void>;
  updateVersion : (version : Configuration) => Promise<void>;
  updateSchema : (versionId : string, schema : Schema) => Promise<void>;
  updateBop : (versionId : string, bop : UIBusinessOperation) => Promise<void>;
  updateProtocol : (versionId : string, protocol : Protocol) => Promise<void>;

  createProject : (project : Project) => Promise<void>;
  createVersion : (projectId : string) => Promise<void>;
  createSchema : (versionId : string) => Promise<void>;
  createBop : (versionId : string) => Promise<Serialized<UIBusinessOperation>>;
  createProtocol : (versionId : string) => Promise<void>;

  deleteProject : (projectId : string) => Promise<void>;
  deleteVersion : (versionId : string) => Promise<void>;
  deleteSchema : (versionId : string, schemaId : string) => Promise<void>;
  deleteBop : (versionId : string, bopId : string) => Promise<void>;
  deleteProtocol : (versionId : string, protocolId : string) => Promise<void>;
}

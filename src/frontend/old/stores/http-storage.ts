import type { FunctionDefinition, MetaFunction, MetaPackage } from "@meta-system/meta-function-helper";
import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";
import axios from "axios";
import type { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
import { get } from "svelte/store";
import type { MetaFileTypes, ValidatedPackage } from "../common/types/validated-packages";
import type { PackageInfo } from "../components/modal/package-list-info";
import { UIBusinessOperation } from "../entities/business-operation";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import { Protocol } from "../entities/protocol";
import { Schema } from "../entities/schema";
import type { Serialized } from "../entities/serialized-type";
import { User } from "../entities/user";
import { localStorageService } from "../services/local-storage-service";
import { availableConfigurations } from "./configuration-store";
import globalUser from "./global-user-store";
import { availableProjects } from "./projects-store";
import type { StorageManagerType } from "./storage-manager";

export class HttpStorageManager implements StorageManagerType {
  private userToken : string;
  private refreshToken = localStorageService.fetchKey("refreshToken");

  private readonly requester = axios.create({
    baseURL: import.meta.env.VITE_BASEURL,
  });

  constructor () {
    this.createSchema = this.createSchema.bind(this);
    this.createProtocol = this.createProtocol.bind(this);
    this.createBop = this.createBop.bind(this);
    this.deleteSchema = this.deleteSchema.bind(this);
    this.getProtocols = this.getProtocols.bind(this);
    this.updateProtocol = this.updateProtocol.bind(this);
    this.updateBop = this.updateBop.bind(this);
    this.updateSchema = this.updateSchema.bind(this);
  }

  // eslint-disable-next-line max-lines-per-function, @typescript-eslint/no-unused-vars
  public async getExternalModules (name ?: string) : Promise<Record<string, FunctionDefinition[]>> {
    const packages = this.requester.get<{data : ValidatedPackage<MetaPackage>[]}>("/packages", {
      headers: { Authorization: this.userToken },
      params: { type: "package", name: name ?? "" },
    });

    const functions = this.requester.get<{data : ValidatedPackage<MetaFunction>[]}>("/packages", {
      headers: { Authorization: this.userToken },
      params: { type: "function", name: name ?? "" },
    });

    const responses = await Promise.all([ packages, functions ]);
    if(responses.some(res => this.wasRequestUnsuccessful(res.status))) throw Error("Unable to get Packages");

    const modules = { "Not in a Package": [] };

    for(const packOrFunction of responses.map(res => res.data.data).flat(1)) {
      if(packOrFunction.type === "function") modules["Not in a Package"].push(packOrFunction.packageConfiguration);
      else {
        const pack = (packOrFunction as ValidatedPackage<MetaPackage>);
        modules[packOrFunction.name] = pack.packageConfiguration.functionsDefinitions;
      }
    }

    return modules;
  }

  public async getProtocols (query ?: string)
    : Promise<Array<PackageInfo<"protocol">>> {
    const protocolResponse = this.requester.get<{data : ValidatedPackage<MetaProtocolDefinition>[]}>("/packages",
      { headers: { Authorization: this.userToken }, params: { type: "protocol", name: query ?? "" } });

    const dbResponse = this.requester.get<{data : ValidatedPackage<MetaProtocolDefinition>[]}>("/packages",
      { headers: { Authorization: this.userToken }, params: { type: "dbProtocol", name: query ?? "" } });
    const responses = await Promise.all([ protocolResponse, dbResponse ]);
    if(responses.some(response => this.wasRequestUnsuccessful(response.status))) throw Error("Unable to get Protocols");

    return responses
      .map(res => res.data.data)
      .flat(1)
      .map(pack => ({
        ...pack.packageConfiguration, protocolName: pack.name,
        version: pack.version, kind: pack.type as ProtocolKind, id: pack._id }));
  }

  public async validatePackage (name : string, type : MetaFileTypes, version : string) : Promise<void> {
    await this.requester.post("/validate-package", {
      packageName: name,
      packageType: type,
      packageVersion: version },
    { headers: { authorization: this.userToken } });
  }

  private wasRequestUnsuccessful = (code : number) : boolean => (!(code >= 200) || !(code < 300));

  async userExists (email : string) : Promise<boolean> {
    const res = await this.requester.post("/user-exists", { email });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Invalid Registration");

    return res.data.exists;
  };


  async registerUser (email : string, password : string) : Promise<void> {
    const res = await this.requester.post("/register", { email, password });


    if(this.wasRequestUnsuccessful(res.status)) throw Error("Invalid Registration");
  };

  // USER METHODS ================================================================
  async loginUser (email : string, password : string) : Promise<void> {
    const res = await this.requester.post("/login", { email, password });


    if(this.wasRequestUnsuccessful(res.status)) throw Error("Invalid Login");

    // This will be unnecessary after HTTP-JSON-Protocol adds support for cookies
    localStorageService.save("refreshToken", res.data.refreshToken);
    this.refreshToken = res.data.refreshToken;
    globalUser.set(new User({ token: res.data.refreshToken }));
    this.userToken = res.data.token;
  }

  async refreshUserAuth () : Promise<void> {
    const res = await this.requester.post("/auth/refresh-authorization", {
      refreshToken: this.refreshToken,
    });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Failed to refresh user auth");

    // This will be unnecessary after HTTP-JSON-Protocol adds support for cookies
    localStorageService.save("refreshToken", res.data.refreshToken);
    this.refreshToken = res.data.refreshToken;
    globalUser.set(new User({ token: res.data.refreshToken }));
    this.userToken = res.data.authorizationToken;
  };

  // DELETE METHODS ================================================================
  async deleteProject (projectId : string) : Promise<void> {
    const res = await this.requester.post("delete-project", {
      projectId,
    },{ headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async deleteVersion (versionId : string) : Promise<void> {
    const res = await this.requester.post("delete-version", {
      versionId: versionId,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async deleteSchema (versionId : string, schemaId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.schemas.findIndex(schema => schema.id === schemaId);
    serializedVersion.schemas.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async deleteBop (versionId : string, bopId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.businessOperations.findIndex(bop => bop.id === bopId);
    serializedVersion.businessOperations.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async deleteProtocol (versionId : string, protocolId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.protocols.findIndex(protocol => protocol.id === protocolId);
    serializedVersion.protocols.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };


  // UPDATE METHODS ================================================================
  async updateProject (project : Project) : Promise<void> {
    const res = await this.requester.post("update-project", {
      project: project.serialized(),
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  }

  async updateVersion (version : Configuration) : Promise<void> {
    const res = await this.requester.post("update-version", {
      version: version.serialized(),
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async updateSchema (versionId : string, schema : Schema) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.schemas.findIndex(_schema => _schema.id === get(schema.id));
    serializedVersion.schemas[index] = schema.serialized();

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async updateBop (versionId : string, newBop : UIBusinessOperation) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.businessOperations.findIndex(_bop => _bop.id === get(newBop.id));
    serializedVersion.businessOperations[index] = newBop.serialized();
    const nameAlreadyPresent = serializedVersion.businessOperations
      .filter(bop => bop.name === get(newBop.name));
    if(nameAlreadyPresent.length > 1) throw Error("The name must be unique among all bops");
    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  }

  async updateProtocol (versionId : string, protocol : Protocol) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.protocols.findIndex(_protocol => _protocol.id === get(protocol.id));
    serializedVersion.protocols[index] = protocol.serialized();

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  // CREATION METHODS ================================================================
  async createProject (project : Project) : Promise<void> {
    const serializedProject = project.serialized();

    const res = await this.requester.put("project", {
      projectName: serializedProject.name,
      projectDescription: serializedProject.description,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");

    await this.loadProjectsToStores();
    await this.loadVersionsToStores(res.data.createdProjectId);
  };

  async createVersion (projectId : string) : Promise<void> {
    const res = await this.requester.put("create-version", {
      projectId: projectId,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");

    await this.loadVersionsToStores(projectId);
  };

  async createSchema (versionId : string) : Promise<void> {
    const schema = await Schema.createNewSchema();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.schemas.push(schema.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async createBop (versionId : string) : Promise<Serialized<UIBusinessOperation>> {
    const bop = await UIBusinessOperation.createNewBOp();
    const versionToAdd = get(availableConfigurations).find(version => get(version.id) === versionId);
    const resolvedBop = {
      ...bop.serialized(),
      name: versionToAdd.getAvailableBopName(get(bop.name)),
    };

    const serializedVersion = versionToAdd.serialized();
    serializedVersion.businessOperations.push(resolvedBop);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    return resolvedBop;
  }

  async createProtocol (versionId : string) : Promise<void> {
    const protocol = await Protocol.createNewProtocol();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.protocols.push(protocol.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  };

  async loadProjectsToStores () : Promise<void> {
    const response = await this.requester.get("/projects", {
      headers: { Authorization: this.userToken },
    });


    response.data.projects = (response.data.projects as Array<any>)
      .map(project => new Project({ ...project, id: project["_id"] }));


    availableProjects.set(response.data.projects);
  }

  async loadVersionsToStores (projectId : string) : Promise<void> {
    const response = await this.requester.get("/versions", {
      headers: { authorization:this.userToken },
      params: { projectId: projectId },
    });

    availableConfigurations.update(() => {
      const result = [...response.data.versions.map(version => new Configuration({ ...version, id: version._id }))];
      return result;
    });
  }; //HTTP GET user-versions

  async appendVersionsToStores (projectId : string) : Promise<void> {
    const response = await this.requester.get("/versions", {
      headers: { authorization:this.userToken },
      params: { projectId: projectId },
    });

    availableConfigurations.update(configs => {
      configs.push(...response.data.versions.map(version => new Configuration({ ...version, id: version._id })));
      return configs;
    });
  }; //HTTP GET user-versions
};


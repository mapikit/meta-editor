import axios from "axios";
import { get } from "svelte/store";
import { UIBusinessOperation } from "../entities/business-operation";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import { Protocol } from "../entities/protocol";
import { Schema } from "../entities/schema";
import { localStorageService } from "../services/local-storage-service";
import { availableConfigurations } from "./configuration-store";
import { availableProjects } from "./projects-store";
import type { StorageManagerType } from "./storage-manager";

export class HttpStorageManager implements StorageManagerType {
  private userToken : string;
  private refreshToken = localStorageService.fetchKey("refreshToken");

  private readonly requester = axios.create({
    baseURL: "http://localhost:3530",
  });

  constructor () {
    this.createSchema = this.createSchema.bind(this);
    this.createProtocol = this.createProtocol.bind(this);
    this.createBop = this.createBop.bind(this);
    this.deleteSchema = this.deleteSchema.bind(this);
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
    console.log(versionId, schemaId);
    console.log(get(availableConfigurations).map(config => config.serialized()));
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    console.log("version", serializedVersion);
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
      project: project,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
  }

  async updateVersion (version : Configuration) : Promise<void> {
    const res = await this.requester.post("update-version", {
      version,
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

  async updateBop (versionId : string, bop : UIBusinessOperation) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.businessOperations.findIndex(_bop => _bop.id === get(bop.id));
    serializedVersion.businessOperations[index] = bop.serialized();

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

    await this.loadVersionsToStores(res.data.createdProjectId);
  };

  async createVersion (projectId : string) : Promise<void> {
    const res = await this.requester.put("version", {
      projectId: projectId,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
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

  async createBop (versionId : string) : Promise<void> {
    const bop = await UIBusinessOperation.createNewBOp();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.businessOperations.push(bop.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
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
      headers: { Authorization:this.userToken },
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

    availableConfigurations.update(configs => {
      configs.push(...response.data.versions.map(version => new Configuration({ ...version, id: version._id })));
      return configs;
    });
  }; //HTTP GET user-versions
};


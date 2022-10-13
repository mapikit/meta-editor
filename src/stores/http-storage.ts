import axios from "axios";
import { get } from "svelte/store";
import { UIBusinessOperation } from "../entities/business-operation";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import { Protocol } from "../entities/protocol";
import { Schema } from "../entities/schema";
import { availableConfigurations } from "./configuration-store";
import { availableProjects } from "./projects-store";
import type { StorageManagerType } from "./storage-manager";

export class HttpStorageManager implements StorageManagerType {
  private userToken : string;
  // eslint-disable-next-line max-len
  private refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RFbWFpbEBnbWFpbC5jb20iLCJpYXQiOjE2NjQyMzAwMTUsImV4cCI6MTY2NjgyMjAxNX0.PjFwbAcwWgJCiStpqb6hJA3LkbDg4WrJ8sxVtD9QOvY";

  private readonly requester = axios.create({
    baseURL: "http://localhost:3530",
    // transformResponse: (res) : object => JSON.parse(res),
  });

  constructor () {
    this.createSchema = this.createSchema.bind(this);
    this.createProtocol = this.createProtocol.bind(this);
    this.createBop = this.createBop.bind(this);
  }

  private wasRequestUnsuccessful = (code : number) : boolean => (!(code >= 200) || !(code < 300));

  async loginUser (email : string, password : string) : Promise<void> {
    const res = await this.requester.post("/login", { email, password });


    if(this.wasRequestUnsuccessful(res.status)) throw Error("Invalid Login");

    this.refreshToken = res.data.refreshToken;
    this.userToken = res.data.token;
  }

  async refreshUserAuth () : Promise<void> {
    const res = await this.requester.post("/auth/refresh-authorization", {
      refreshToken: this.refreshToken,
    });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Failed to refresh user auth");

    this.refreshToken = res.data.refreshToken;
    this.userToken = res.data.authorizationToken;
  };

  // DELETE METHODS
  async deleteProject (projectId : string) : Promise<void> {
    const res = await this.requester.post("delete-project", {
      projectId,
    },{ headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableProjects.update(projects => {
      const index = projects.findIndex(_project => get(_project.id) === projectId);
      projects.splice(index, 1);
      return projects;
    });
  };

  async deleteVersion (versionId : string) : Promise<void> {
    const res = await this.requester.post("delete-version", {
      versionId: versionId,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      const index = versions.findIndex(version => get(version.id) === versionId);
      versions.splice(index, 1);
      return versions;
    });
  };

  async deleteSchema (versionId : string, schemaId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.schemas.findIndex(schema => schema.id === schemaId);
    serializedVersion.schemas.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).schemas.splice(index);
      return versions;
    });
  };

  async deleteBop (versionId : string, bopId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.businessOperations.findIndex(bop => bop.id === bopId);
    serializedVersion.businessOperations.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).businessOperations.splice(index);
      return versions;
    });
  };

  async deleteProtocol (versionId : string, protocolId : string) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.protocols.findIndex(protocol => protocol.id === protocolId);
    serializedVersion.protocols.splice(index, 1);

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).protocols.splice(index);
      return versions;
    });
  };


  // UPDATE METHODS
  async updateProject (project : Project) : Promise<void> {
    const res = await this.requester.post("update-project", {
      project: project,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableProjects.update(projects => {
      const index = projects.findIndex(_project => get(_project.id) === get(project.id));
      projects[index] = project;
      return projects;
    });
  }

  async updateVersion (version : Configuration) : Promise<void> {
    const res = await this.requester.post("update-version", {
      version,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(configs => {
      const index = configs.findIndex(_project => get(_project.id) === get(version.id));
      configs[index] = version;
      return configs;
    });
  };

  async updateSchema (versionId : string, schema : Schema) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.schemas.findIndex(_schema => _schema.id === get(schema.id));
    serializedVersion.schemas[index] = schema.serialized();

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).schemas.push(schema);
      return versions;
    });
  };

  async updateBop (versionId : string, bop : UIBusinessOperation) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.businessOperations.findIndex(_bop => _bop.id === get(bop.id));
    serializedVersion.businessOperations[index] = bop.serialized();

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).businessOperations.push(bop);
      return versions;
    });
  }

  async updateProtocol (versionId : string, protocol : Protocol) : Promise<void> {
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    const index = serializedVersion.protocols.findIndex(_protocol => _protocol.id === get(protocol.id));
    serializedVersion.protocols[index] = protocol.serialized();

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).protocols.push(protocol);
      return versions;
    });
  };

  // CREATION METHODS
  async createProject (project : Project) : Promise<void> {
    const serializedProject = project.serialized();

    const res = await this.requester.put("project", {
      projectName: serializedProject.name,
      projectDescription: serializedProject.description,
    }, { headers: { authorization: this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");

    await this.loadVersionsToStores(res.data.createdProjectId);


    availableProjects.update((current) => {
      current.push(new Project({ ...project.serialized(), id: res.data.createdProjectId }));

      return current;
    });
  };

  async createVersion (projectId : string) : Promise<void> {
    const res = await this.requester.put("version", {
      projectId: projectId,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.push(res.data.createdVersion);
      return versions;
    });
  };

  async createSchema (versionId : string) : Promise<void> {
    const schema = await Schema.createNewSchema();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.schemas.push(schema.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).schemas.push(schema);
      return versions;
    });
  };

  async createBop (versionId : string) : Promise<void> {
    const bop = await UIBusinessOperation.createNewBOp();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.businessOperations.push(bop.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).businessOperations.push(bop);
      return versions;
    });
  }

  async createProtocol (versionId : string) : Promise<void> {
    const protocol = await Protocol.createNewProtocol();
    const serializedVersion = get(availableConfigurations).find(version => get(version.id) === versionId).serialized();
    serializedVersion.protocols.push(protocol.serialized());

    const res = await this.requester.post("update-version", {
      version: serializedVersion,
    }, { headers: { authorization:this.userToken } });

    if(this.wasRequestUnsuccessful(res.status)) throw Error("Request Error");
    availableConfigurations.update(versions => {
      versions.find(version => get(version.id) === versionId).protocols.push(protocol);
      return versions;
    });
  };

  async loadProjectsToStores () : Promise<void> {
    // const test = await (new Axios({})).get("www.google.com");
    // console.log(test);
    const response = await this.requester.get("/projects", {
      headers: { Authorization:this.userToken },
    });

    console.log(response.data);

    response.data.projects = (response.data.projects as Array<any>)
      .map(project => new Project({ ...project, id: project["_id"] }));

    console.log(response.data);


    availableProjects.set(response.data.projects);
    // availableProjects.update(projects => {
    //   projects.push(...response.data.projects);
    //   return projects;
    // });
  }

  async loadVersionsToStores (projectId : string) : Promise<void> {
    const response = await this.requester.get("/versions", {
      headers: { authorization:this.userToken },
      params: { projectId: projectId },
    });

    // console.log(response);

    availableConfigurations.update(configs => {
      configs.push(...response.data.versions.map(version => new Configuration({ ...version, id: version._id })));
      return configs;
    });
  }; //HTTP GET user-versions
};


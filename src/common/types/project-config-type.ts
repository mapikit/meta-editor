export type ProjectConfigType = {
  projectName : string;
  description : string;
  createdAt : string;
  updatedAt : string;
  versions : Array<ProjectVersionInfo>;
}


export type ProjectVersionInfo = {
  version : string;
  path : string;
  updatedAt : string;
  createdAt : string;
};

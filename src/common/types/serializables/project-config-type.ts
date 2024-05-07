export type ProjectConfigType = {
  identifier : string;
  projectName : string;
  description : string;
  createdAt : string;
  updatedAt : string;
  versions : Array<ProjectVersionInfo>;
}


export type ProjectVersionInfo = {
  identifier : string;
  version : string;
  path : string;
  updatedAt : string;
  createdAt : string;
};

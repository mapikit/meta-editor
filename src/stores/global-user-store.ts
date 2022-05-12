import { Schema } from "../entities/schema";
import { Configuration } from "../entities/configuration";
import { Project } from "../entities/project";
import { User } from "../entities/user";

const globalUser = new User({ id: "sampleId", email: "useremail@mapikit.com" });

//-------------------------------------------
// Mock data to be removed
const mockSchema1 : Schema = new Schema({
  id: "schema1",
  format: {},
  dbProtocol: "exampleValueHere :D",
  name: "Schema Name1",
  description: "faksdflkajsdnjklga",
  isLocked: false,
  isStarred: false,
});

const mockConfiguration1 : Configuration = new Configuration({
  id: "config1",
  version: "1.0.0",
  schemas: [mockSchema1],
});

const mockProjects = [];
mockProjects.push(new Project({
  id: "1abcd",
  name: "MockProject1",
  description: "Sample description",
  configuration: mockConfiguration1,
  isStarred: false,
}));

globalUser._TEMP_setProjects(mockProjects).catch(() => {
  console.log("if you see this message, something went real wrong");
});

// End of mock data
//-------------------------------------------
export default globalUser;

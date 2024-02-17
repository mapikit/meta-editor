import axios from "axios";
import type { PackageListInfo, SpecificPackageInfo } from "./package-list-info";
import { Unpacker } from "../../lib/custom-unpacker/custom-upacker";
import { isMetaProtocol } from "@meta-system/meta-protocol-helper";
import { isFunctionDefinition, isMetaFunction, isMetaPackage } from "@meta-system/meta-function-helper";
import { validateTypes } from "@meta-system/meta-function-helper/dist/src/validate-configuration";

type MetaFilesTypes = "package" | "protocol" | "function"


export class NPMApi {
  // private requester = axios.create({ baseURL: "https://registry.npmjs.org" });

  static async queryModules (name = "") : Promise<Array<PackageListInfo<"function" | "package" | "protocol">>> {
    const objs = (await axios.get("https://registry.npmjs.org/-/v1/search",
      { params: { text: name, size: 8 } })).data.objects;

    const resolved : Array<PackageListInfo<"function" | "package" | "protocol">> = objs.map(obj => ({
      header: {
        name: obj.package.name,
        author: obj.package.author?.name ?? obj.package.publisher.username,
        versions: [obj.package.version],
        description: obj.package.description,
      },
      fullPackages: [{ ...obj.package }],
    }));
    return resolved;
  }

  static async getVersions (packageName : string) : Promise<Array<string>> {
    const versions = (await axios.get(`https://registry.npmjs.org/${packageName}`)).data.versions;
    return Object.keys(versions).reverse();
  }

  // eslint-disable-next-line max-lines-per-function
  static async validateMetaFile (pack : string, version : string, fileType : MetaFilesTypes)
    : Promise<SpecificPackageInfo> {
    // eslint-disable-next-line max-len
    const path = `${pack}/-/${pack.startsWith("@") ? pack.split("/")[1] : pack}-${version}.tgz`;
    const tgzFile = (await axios.get(`https://registry.npmjs.org/${path}`, { responseType: "arraybuffer" })).data;
    const entries = Unpacker.unpackTgzFile(tgzFile);
    const metaFileName = `package/meta-${fileType}.json`;

    const metaFileIndex = entries.findIndex(entry => entry.header.name === metaFileName);
    if(metaFileIndex === -1) throw Error(`No meta-${fileType}.json present in package`);;

    const packageJsonIndex = entries.findIndex(entry => entry.header.name === "package/package.json");

    const metaFile = Unpacker.getJsonData(entries[metaFileIndex].data);
    const packageJson = Unpacker.getJsonData(entries[packageJsonIndex].data);
    let configuration;

    switch (fileType) {
      case "function":
        isMetaFunction(metaFile);
        validateTypes(metaFile);
        configuration = metaFile;
        break;
      case "package":
        isMetaPackage(metaFile);
        metaFile.functionsDefinitions.forEach(def => {
          if(typeof def === "object") isFunctionDefinition(def);
          else {
            isFunctionDefinition(
              Unpacker.getJsonData(entries.find(entry => entry.header.name === `package/${def}`)?.data as Uint8Array));
          }
        });
        configuration = metaFile;
        break;
      case "protocol":
        isMetaProtocol(metaFile);
        if(metaFile.functionDefinitions === undefined) break;
        for(const protocolFunction of metaFile.functionDefinitions) isFunctionDefinition(protocolFunction);
        configuration = metaFile;
        break;
    }

    // await validateFunction(metaFile);
    if(metaFile["version"] && metaFile["version"] !== packageJson["version"]) {
      throw Error("Version mismatch between meta-file and package.json. "
      + `[${metaFile["version"]} x ${packageJson["version"]}]`,
      );
    }

    return {
      author: metaFile.author ?? packageJson["author"],
      description: metaFile.description ?? packageJson["description"],
      type: fileType,
      name: pack,
      version: metaFile.version ?? packageJson["version"],
      configuration,
    };
    // NOTE This will be baked into the validation functions in the future;
    // 1111.1687810000033ms vs 5321.542198699992ms
  }
}


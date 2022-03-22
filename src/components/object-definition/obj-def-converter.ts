import { isObjectDefinition, ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
import { defaultTypesValues } from "./default-types-values";

export type DefinitionData = {
  keyName: string;
  value: unknown;
  type: TypeDefinition["type"];
  required : boolean;
  subtype?: unknown
}

const isObjectDefinitionCheck = (value : object) : boolean => {
  try {
    isObjectDefinition(value);
    return true;
  } catch {
    return false;
  }
}

// Also can populate the values of the definitionData if `objValue` is specified
export const convertObjDefinitionToDefinitionData =
(objDef : ObjectDefinition, objValue ? : object) : DefinitionData[] => {
  const keys = Object.keys(objDef);
  const result : DefinitionData[] = [];

  keys.forEach((key) => {
    const partialResult = {
      keyName: key,
      value: objValue[key] ?? defaultTypesValues[objDef[key].type] ?? "",
      type: objDef[key].type,
      required: objDef[key].required ?? false,
      subtype: objDef[key]["subtype"]
    };

    const isDeepObject = isObjectDefinitionCheck(objDef[key]["subtype"]);

    if (isDeepObject) {
      partialResult["subtype"] = convertObjDefinitionToDefinitionData(objDef[key]["subtype"], objValue[key]);
      partialResult.value = {};
      result.push(partialResult);
      return;
    }

    result.push(partialResult);
  });

  return result;
};

export const getDataFromDefinitionData = (defData : DefinitionData[]) : object => {
  const result = {};

  defData.forEach((defData) => {
    result[defData.keyName] = defData.value;
  });

  return result;
};

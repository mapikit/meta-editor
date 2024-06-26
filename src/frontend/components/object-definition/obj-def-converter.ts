/* eslint-disable max-lines-per-function */
import { isObjectDefinition, ObjectDefinition, TypeDefinition } from "@meta-system/object-definition";
import { defaultTypesValues } from "./default-types-values";

export type DefinitionData = {
  keyName : string;
  value : unknown;
  type : TypeDefinition["type"] | TypeDefinition["type"][];
  required : boolean;
  subtype ?: unknown
}

const isObjectDefinitionCheck = (value : object) : boolean => {
  try {
    isObjectDefinition(value);
    return true;
  } catch {
    return false;
  }
};

// Also can populate the values of the definitionData if `objValue` is specified
export const convertObjDefinitionToDefinitionData =
(objDef : ObjectDefinition, objValue : object = {}) : DefinitionData[] => {
  const keys = Object.keys(objDef ?? {});
  const result : DefinitionData[] = [];

  keys.forEach((key) => {
    const value = Array.isArray(objDef[key])
      ? (objDef[key] as TypeDefinition[]).map((def) => objValue[key] ?? defaultTypesValues[def.type] ?? "")
      : (objDef[key] ?? defaultTypesValues[(objDef[key] as TypeDefinition).type] ?? "");
    const type = Array.isArray(objDef[key])
      ? (objDef[key] as TypeDefinition[]).map((t) => t.type)
      : (objDef[key] as TypeDefinition).type;

    const required = Array.isArray(objDef[key]) ? false : (objDef[key] as TypeDefinition).required;
    const partialResult = {
      keyName: key,
      value,
      type,
      required,
      subtype: objDef[key]["subtype"],
    };

    if (objDef[key]["type"] === "array") {
      partialResult["subtype"] = typeof objDef[key]["subtype"] === "string" ? objDef[key]["subtype"] :
        {
          subtype: convertObjDefinitionToDefinitionData(objDef[key]["subtype"], objValue[key] ?? {}),
          keyName: "Objects of Array",
          type: "object",
          value: {},
          required: true,
        };

      partialResult.value = [];
      const valuesToBeAdded = objValue[key] ?? [];
      valuesToBeAdded.forEach((item, index) => {
        const itemValueDefinition = {
          subtype: [], // is the array type (already DefinitionData),
          keyName: "Object in Array",
          type: "object",
          value: {},
          required: true,
        };

        const arrayValueConverted = convertObjDefinitionToDefinitionData(objDef[key]["subtype"], objValue[key][index]);
        itemValueDefinition.subtype.push(...arrayValueConverted);
        partialResult.value.push(itemValueDefinition);
      });

      result.push(partialResult);
      return;
    }

    const isDeepObject = isObjectDefinitionCheck(objDef[key]["subtype"]);

    if (isDeepObject || objDef[key]["type"] === "cloudedObject") {
      partialResult["subtype"] =
        convertObjDefinitionToDefinitionData(objDef[key]["subtype"] ?? {}, objValue[key] ?? {});
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

  defData.forEach((definitionData) => {
    result[definitionData.keyName] = definitionData.value;
  });

  return result;
};

export const convertDefinitionDataToObjectDefinition = (definitionData : DefinitionData)
: { definition : ObjectDefinition; data : object } => {
  const result : { definition : ObjectDefinition; data : object } = {
    definition : {},
    data: {},
  };

  if (definitionData.type === "array") {
    result.definition[definitionData.keyName] = {
      "type": "array",
      "required": definitionData.required,
      "subtype": definitionData.subtype as string,
    };
    result.data[definitionData.keyName] = definitionData.value;

    if (typeof definitionData.subtype === "object") {
      const arrayDefinitionResult = {};
      (definitionData.subtype["subtype"] as DefinitionData[]).forEach((arrayProp) => {
        const convertedProp = convertDefinitionDataToObjectDefinition(arrayProp);
        Object.assign(arrayDefinitionResult, convertedProp.definition);
      });

      result.data[definitionData.keyName] = [];

      (definitionData["value"] as DefinitionData[]).forEach((arrayItem) => {
        const innerItemValues = arrayItem["subtype"] as DefinitionData[];
        const arrayItemValueResult = {};
        innerItemValues.forEach((innerItem) => {
          const convertedItem = convertDefinitionDataToObjectDefinition(innerItem);
          Object.assign(arrayItemValueResult, convertedItem.data);
        });

        result.data[definitionData.keyName].push(arrayItemValueResult);
      });

      result.definition[definitionData.keyName]["subtype"] = arrayDefinitionResult;

      return result;
    }

    return result;
  }

  if (definitionData.type === "object") {
    result.definition[definitionData.keyName] = {
      "type": "object",
      "required": definitionData.required,
      "subtype": {},
    };

    result.data[definitionData.keyName] = {};

    (definitionData.subtype as DefinitionData[]).forEach((innerDefinitionData) => {
      const innerConverted = convertDefinitionDataToObjectDefinition(innerDefinitionData);

      result.definition[definitionData.keyName]["subtype"][innerDefinitionData.keyName]
        = innerConverted.definition[innerDefinitionData.keyName];
      result.data[definitionData.keyName][innerDefinitionData.keyName]
        = innerConverted.data[innerDefinitionData.keyName];
    });

    return result;
  }

  if (definitionData.type === "cloudedObject") {
    result.definition[definitionData.keyName] = {
      "type": "cloudedObject",
      "required": definitionData.required,
    };

    result.data[definitionData.keyName] = {};

    (definitionData.subtype as DefinitionData[]).forEach((innerDefinitionData) => {
      const innerConverted = convertDefinitionDataToObjectDefinition(innerDefinitionData);

      result.data[definitionData.keyName][innerDefinitionData.keyName]
        = innerConverted.data[innerDefinitionData.keyName];
    });

    return result;
  }

  if (definitionData.type === "enum") {
    result.definition[definitionData.keyName] = {
      "type": "enum",
      "subtype": definitionData.subtype as [],
    };

    return result;
  }

  if(definitionData.type === "number") {
    definitionData.value = Number(definitionData.value);
  }

  if (Array.isArray(definitionData.type)) {
    result.definition[definitionData.keyName] = definitionData.type.map((t) => {
      return { type: t, required: definitionData.required };
    });

    return result;
  }

  result.definition[definitionData.keyName] = {
    "type": definitionData.type,
    "required": definitionData.required,
  };

  result.data[definitionData.keyName]= definitionData.value;


  return result;
};

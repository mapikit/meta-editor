<script lang="ts">
  import type { FunctionDefinition } from "@meta-system/meta-function-helper";
  import type { Writable } from "svelte/store";
  import type { ModuleCard } from "../../../../common/types/module-card";
  import { FunctionsInfo } from "../../helpers/functions-info";
  import StoreSection from "../store-section.svelte";
  
  export let search = "";
  export let storeLocked = false;
  export let bopModules : Writable<ModuleCard[]>;

  interface ModuleSeparation {
    name : string;
    description ?: string;
    modules : Array<string>;
  }

  const internalModulesSections : Record<string, ModuleSeparation> = {
    math: {
      name: "Math Functions",
      description: "Functions for working with and manipulating numbers",
      modules: ["add", "subtract", "divide", "multiply", "absolute", "exponential", "modulus", "round",
        "sqrt",
      ],
    },
    array: {
      name: "Array Functions",
      modules: ["arrayAt", "arrayFindIndex", "includes", "arrayJoin", "arrayLength", "arrayPush", "arrayRemove"],
    },
    logic: {
      name: "Logic Functions",
      modules: ["and", "equalTo", "higherOrEqualTo", "higherThan", "lowerOrEqualTo", "lowerThan", "not", "or"],
    },
    assertion: {
      name: "Assertion Functions",
      modules: ["isNill"],
    },
    date: {
      name: "Date Functions",
      modules: ["dateNow"],
    },
    flux: {
      name: "Flux Control Functions",
      modules: ["forLoop", "if", "tryCatch"],
    },
    number: {
      name: "Number Functions",
      modules: ["randomNumber", "toExponential", "numberToString"],
    },
    object: {
      name: "Object Functions",
      modules: ["combineObject", "createObject", "getObjectPropertyValue", "getObjectKeys", "objectToString", "getObjectValues"],
    },
    string: {
      name: "String Functions",
      modules: ["charAt", "stringConcat", "countString", "indexOfString", "stringReplace", "stringTemplate", "stringToNumber"],
    },
    boolean: {
      name: "Boolean Functions",
      modules: ["boolToNumber", "boolToString"],
    },
    system: {
      name: "System Functions",
      modules: ["executeWithArgs", "getSystemFunction"],
    },
  };

  function getSeparatedModules () {
    const separatedModules : { [name : string] : Array<FunctionDefinition> } = {};
    const functionsInfo = FunctionsInfo.getInternalsInfo;
    for(const module of functionsInfo) {
      let saved = false;
      for(const sectionInfo of Object.values(internalModulesSections)) {
        if(separatedModules[sectionInfo.name] === undefined) separatedModules[sectionInfo.name] = [];
        if(sectionInfo.modules.includes(module.functionName)) {
          separatedModules[sectionInfo.name].push(module);
          saved = true;
          break;
        };
      }
      if(!saved) {
        if(separatedModules["Other Functions"] === undefined) separatedModules["Other Functions"] = [];
        separatedModules["Other Functions"].push(module);
      }
    }
    return separatedModules;
  }

  const separatedModules = getSeparatedModules();
</script>

<div class="h-full w-full overflow-y-auto">
  {#each Object.keys(separatedModules) as item}
    <StoreSection
      sectionModulesType="internal"
      summary={item} 
      modulesInSection={separatedModules[item]}
      bind:search
      bind:storeLocked
      bind:bopModules
    />
  {/each}
</div>

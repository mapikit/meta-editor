<script lang="ts">
	import { get } from "svelte/store";
	import { UIBusinessOperation } from "../../../entities/business-operation";
	import { Project } from "../../../entities/project";
	import { Protocol } from "../../../entities/protocol";
	import { Schema } from "../../../entities/schema";
  import { navigation } from "../../../lib/navigation";
	import { availableConfigurations } from "../../../stores/configuration-store";
	import { availableProjects } from "../../../stores/projects-store";

  type FavoriteType = {
    type: "BOp" | "Project" | "Schema" | "Protocol";
    name: string;
    description: string;
    route: string;
  }

  const colors : Record<FavoriteType["type"], string> = { // TODO change to icons
    BOp: "roseRed",
    Project: "white",
    Protocol: "ochreYellow",
    Schema: "brightGreen",
  }

  function getItemRoute(item : UIBusinessOperation | Project | Schema | Protocol, projectId ? : string, configId ?: string) : string {
    const route = "/mapibox";
    
    if(item instanceof Project) {
      const projectConfigs = get(availableConfigurations).filter(config => config.projectId);
        // TODO determine wich version to show; possibly latest
      return `${route}/system/${get(item.id)}/configuration/${get(projectConfigs[0].id)}`
    }
    // const projectId = get(availableConfigurations).find(project => get(project.id) === configId).id;
    if(item instanceof Schema) return `${route}/system/${projectId}/configuration/${configId}/schemas/${get(item.id)}` 
    if(item instanceof UIBusinessOperation) return `${route}/system/${projectId}/configuration/${configId}/bops/${get(item.id)}`
    if(item instanceof Protocol) return `${route}/system/${projectId}/configuration/${configId}/protocols/${get(item.id)}`
  }

  const favorites : Array<FavoriteType> = $availableProjects
    .filter(project => get(project.isStarred))
    .map(project => ({ 
      type: "Project",
      name: get(project.name),
      description: get(project.description),
      route: getItemRoute(project),
    }))
 
  $availableConfigurations
    .forEach(config => {
      const starredConfigBops : Array<FavoriteType> = config.businessOperations
        .filter(bop => get(bop.isStarred))
        .map(bop => ({ 
          type: "BOp", 
          name: get(bop.name), 
          description: get(bop.description), 
          route: getItemRoute(bop, get(config.projectId), get(config.id))
        }));
      
      const starredConfigProtocols : Array<FavoriteType> = config.protocols
        .filter(protocol => get(protocol.isStarred))
        .map(protocol => ({ 
          type: "Protocol", 
          name: get(protocol.protocolName), 
          description: get(protocol.description), 
          route: getItemRoute(protocol, get(config.projectId), get(config.id))
        }));
      
      const starredConfigSchemas : Array<FavoriteType> = config.schemas
        .filter(schema => get(schema.isStarred))
        .map(schema => ({ 
          type: "Schema",
          name: get(schema.name),
          description: get(schema.description),
          route: getItemRoute(schema, get(config.projectId), get(config.id))
        }));

      favorites.push(...starredConfigBops, ...starredConfigProtocols, ...starredConfigSchemas);
    })
</script>

<div class="mt-16 w-[870px]">
  <p class="mb-6 text-xl font-bold ml-2"> Quick Access </p>
  <div class="bg-norbalt-350 rounded p-10 grid grid-cols-3 gap-8">
  {#if favorites.length === 0}
    <div class="text-norbalt-100 text-center text-lg"> When you star something, it will apear here. </div>
  {:else}
    {#each favorites as favoriteItem}
      <div class="bg-norbalt-300 w-auto px-6 py-3 rounded-lg border-transparent border-[3px] hover:border-norbalt-100 hover:shadow transition-all shadow-light cursor-pointer" 
        on:click="{() => navigation.navigateTo(favoriteItem.route)}">
        <div class="text-{colors[favoriteItem.type]}  text-lg font-semibold pl-4 pr-2"> {favoriteItem.name} </div>
        <div class="text-offWhite mt-3 font-semibold pl-4 pr-2"> {favoriteItem.description} </div>
      </div>
    {/each}
  {/if}
  </div>
</div>

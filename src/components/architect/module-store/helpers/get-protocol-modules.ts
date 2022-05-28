import type { FunctionDefinition } from "@meta-system/meta-function-helper";
import { mapikitServer } from "../../../../common/network";
import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper";
import type { Protocol } from "../../../../entities/protocol";
import { get } from "svelte/store";

export async function getProtocolModules (protocols : Protocol[]) :  Promise<Record<string, FunctionDefinition[]>> {
  if(protocols === undefined) return {};
  const protocolsQuery = protocols.map(name => `protocolNames[]=${name}`).join("&");
  const protocolsInfo : MetaProtocolDefinition[] =
    (await mapikitServer.get(`getProtocols/?${protocolsQuery}`)).data.protocols;
  const perIdInfo : Record<string, FunctionDefinition[]> =  {};
  for(const protocol of protocols) {
    perIdInfo[get(protocol.identifier)] =
      protocolsInfo.find(info => info.protocolName === get(protocol.protocolName))
        .functionDefinitions as FunctionDefinition[];
  }

  return perIdInfo;
}

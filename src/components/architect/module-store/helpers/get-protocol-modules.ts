import type { FunctionDefinition } from "@meta-system/meta-function-helper"
import type { ConfigurationType } from "meta-system"
import { mapikitServer } from "../../../../common/network"
import type { MetaProtocolDefinition } from "@meta-system/meta-protocol-helper"

export async function getProtocolModules (system : ConfigurationType) :  Promise<Record<string, FunctionDefinition[]>> {
  if(system.protocols === undefined) return {};
  const systemProtocols = system.protocols.map(protocol => protocol.protocol)
  const protocolsQuery = systemProtocols.map(name => `protocolNames[]=${name}`).join("&")
  const protocolsInfo : MetaProtocolDefinition[] = (await mapikitServer.get(`getProtocols/?${protocolsQuery}`)).data.protocols
  const perIdInfo : Record<string, FunctionDefinition[]> =  {}
  for(const protocol of system.protocols) {
    perIdInfo[protocol.identifier] = 
      protocolsInfo.find(info => info.protocolName === protocol.protocol).functionDefinitions as FunctionDefinition[]
  }

  return perIdInfo;
}
<script lang="ts">
import PebblesContainer from "../components/pebbles-container.svelte";
import Header from "../components/header.svelte";
import MapikitLogo from "../components/mapikit-logo.svelte";
import type { ConfigurationType } from "meta-system";
import EditionCanvas from "../components/architect/edition-canvas.svelte";
import type { UICompliantBop } from "../common/types/ui-bop";
import { bopStore } from "../stores/bop-store";
import { systemStore } from "../stores/system-store";
import { ProtocolKind } from "meta-system/dist/src/configuration/protocols/protocols-type";
  const systemConfig : ConfigurationType = {
    name: "TestSystem",
    schemas: [
      {
        dbProtocol: "fake",
        format: {},
        identifier: "fakeSchema",
        name: "Users"
      },
      {
        dbProtocol: "fake",
        format: {
          isJojoRef: { type: "boolean" },
          haveADream: { type: "boolean" }
        },
        identifier: "fakeSchema2",
        name: "Ora"
      }
      
    ],
    businessOperations: [
      {
        name: "My BOp",
        customObjects: [],
        constants: [
          { name: "zeroValue", type: "number", value: 0 },
          { name: "nome", type: "string", value: "Fabu" }
        ],
        variables: [],
        configuration: [
          {
            key: 1,
            moduleName: "if",
            moduleType: "internal",
            dependencies: [
              { origin: "constants", targetPath: "ifTrue", originPath: "nome" }
            ],
          },
          {
            key: 2,
            moduleName: "add",
            moduleType: "internal",
            dependencies: [],
          }
        ],
        input: {
          A : { type: "number" },
          B : { type: "number" }
        },
        output: {
          O : { type: "string" }
        },
      }
    ],
    version: "1.0.0",
    envs: [],
    protocols: [
      {
        protocol: "cronjob-protocol",
        protocolVersion: "latest",
        protocolKind: ProtocolKind.normal,
        identifier: "cron1",
        configuration: {}
      }
    ]
  }
  systemStore.set(systemConfig);
  bopStore.set(systemConfig.businessOperations[0] as unknown as UICompliantBop);

</script>

<title>Mapikit - Coming soon</title>
<body>
  <EditionCanvas/>
  <!-- <Header />
  <MapikitLogo />
  <br>
  <PebblesContainer />
  <br>
  <h1> Coming Soon... </h1> -->
</body>

<style lang="scss">
  .button {
    position: absolute;
    left: 100px;
    top: 50px;
  }

  body {
    text-align: center;
    font-family: Dosis;
    overflow: hidden;
  }

  h1 {
    position: absolute;
    margin-bottom: auto;
    margin-left: auto;
    bottom: calc(20% - 15px);
    left: calc(50% - 3em);
    padding: 0 16px;
    font-size: 4em;
    color: #171730;
    z-index: 5;
  }

  @media only screen and (min-width: 768px) {
    h1 {
      font-size: 5.5em;
      bottom: calc(15% - 15px);
    }
  }
</style>
<script lang="ts">
import PebblesContainer from "../components/pebbles-container.svelte";
import Header from "../components/header.svelte";
import MapikitLogo from "../components/mapikit-logo.svelte";
import Module from "../components/architect/module-cards/module-card.svelte";
import type { ConfigurationType } from "meta-system";
import type { BusinessOperations } from "meta-system/dist/src/configuration/business-operations/business-operations-type";
import EditionCanvas from "../components/architect/edition-canvas.svelte";
import type { UICompliantBop } from "../common/types/ui-bop";
import { bopStore } from "../stores/bop-store";

  const bopsConfig : BusinessOperations = {
    name: "My BOp",
    customObjects: [],
    constants: [],
    variables: [],
    configuration: [
      {
        key: 1,
        moduleName: "if",
        moduleType: "internal",
        dependencies: [],
      },
      {
        key: 2,
        moduleName: "add",
        moduleType: "internal",
        dependencies: [],
      }
    ],
    input: {},
    output: {},
  }

  bopStore.set(bopsConfig as unknown as UICompliantBop);

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
<script>
  import ObjectDefinitionMiniApp from "../../../components/object-definition/object-definition-mini-app.svelte";

  let miniApp;
  let namesLol = [];
  const definition = {
    "aProp": {
      "type": "object",
      "required": true,
      "subtype": {
        "inner": {
          "type": "array",
          "required": false,
          "subtype": {
            "4321": {
              "type": "number",
              "required": false,
            },
            "test": {
              "type": "object",
              "required": false,
              "subtype": {
                "This is a deep test bro": {
                  "type": "boolean",
                  "required": false,
                },
              },
            },
            "again": {
              "type": "date",
              "required": false,
            },
          },
        },
      },
    },
};

const initialData = { aProp: {
    inner: [
      { "4321": 8831890, test: { "This is a deep test bro": true }, again: new Date(848818923981) },
    ],
} };

</script>
<div class="center">
  {namesLol.join(",")}
  <div on:click="{() => {console.log(miniApp.getDefinitionAndData());}}"> GET RESULTS </div>
  <div on:click="{miniApp.navigateBackToLevel(namesLol.length - 1)}"> BACC </div>
  <ObjectDefinitionMiniApp
    bind:this={miniApp}
    on:navigation-event={(data) => {namesLol = data.detail.namePaths;}}
    initialDefinition={definition}
    initialData={initialData}
  />
</div>

<style lang="scss">
  .center {
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    width: 230px;
    background-color: #202031;
    border-radius: 12px;
    padding: 12px 4px;
  }
</style>

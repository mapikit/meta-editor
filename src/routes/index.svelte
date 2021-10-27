<script>
import PebblesContainer from "../components/pebbles-container.svelte";
import Header from "../components/header.svelte";
import MapikitLogo from "../components/mapikit-logo.svelte";

</script>

<title>Mapikit - Coming soon</title>
<body>
  <Header />
  <MapikitLogo />
  <br>
  <PebblesContainer />
  <br>
  <h1> Coming Soon... </h1>
</body>

<style lang="scss">
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
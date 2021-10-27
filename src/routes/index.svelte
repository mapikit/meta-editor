<script>
import Header from "../components/header.svelte";
import MapikitLogo from "../components/mapikit-logo.svelte";
import Pebbles from "../components/pebble.svelte";

</script>

<title>Mapikit - Coming soon</title>
<body>
  <Header />
  <MapikitLogo />
  <br>
  <Pebbles xStart={10} xSpread={80} yStart={20} ySpread={3}/>
  <br>
  <h1> Coming Soon... </h1>
</body>

<style lang="scss">
  body {
    text-align: center;
    font-family: Dosis;
  }

  h1 {
    padding: 0 16px;
    font-size: 4em;
    color: rgba(255, 255, 255, 0.055);
  }

  @media only screen and (min-width: 768px) {
    h1 {
      font-size: 5.5em;
    }
  }
</style>
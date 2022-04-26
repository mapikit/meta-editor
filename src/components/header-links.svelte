<script lang="ts">
  import ExternalLinkIcon from "./common/icons/colored-icons/external-link-icon.svelte";
</script>

<a class="link" target="blank" href="https://discord.gg/ndGsnbTW7V">
  Meta-System Discord
  <ExternalLinkIcon color="white" height={25}/>
</a>
<a class="link" target="blank" href="https://mapikit.github.io/meta-system-docs/">
  Meta-System Documentation
  <ExternalLinkIcon color="white" height={25}/>
</a>

<style>
.link {
    color: white;
    text-decoration: none;
    float: right;
    margin-right: 20px;
    font-size: 18px;
    transition: all 150ms ease;
  }

  .link:hover {
    color: #46ee92
  }
</style>

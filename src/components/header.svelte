<script>
import ExternalLinkIcon from "../colored-icons/external-link-icon.svelte";

</script>
<div>
  <a class="link" target="blank" href="https://discord.gg/ndGsnbTW7V">
    Meta-System Discord
    <ExternalLinkIcon color="white" height={25}/>
  </a>
  <a class="link" target="blank" href="https://mapikit.github.io/meta-system-docs/">
    Meta-System Documentation
    <ExternalLinkIcon color="white" height={25}/>
  </a>
</div>

<style>
  div {
    height: 48px;
    background-color: #171730;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;
    align-items: center;
  }

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
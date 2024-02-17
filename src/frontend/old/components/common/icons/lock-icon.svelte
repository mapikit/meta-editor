<script lang="ts">
  export let locked : boolean;
  export let iconColor : string;
  export let width  = 3.142;
  export let height  = 5.484;
  export let scale  = 1;

  let finalHeight;
  let finalWidth;

  $: {
    finalHeight = height * scale;
    finalWidth = width * scale;
  }
</script>

{#if locked}
<svg width={finalWidth+"mm"} height={finalHeight+"mm"} version="1.1" viewBox="0 0 3.142 5.484" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-85.063 -68.9)">
   <path d="m87.809 70.274h-0.1964v-0.3928c0-0.542-0.4399-0.9818-0.9819-0.9818s-0.9818 0.4398-0.9818 0.9818l-0.011 0.4167 0.4072 0.055v-0.4714c0-0.3259 0.2631-0.5891 0.5891-0.5891s0.5891 0.2632 0.5891 0.5891v0.3928h-1.7673c-0.2161 0-0.3928 0.1767-0.3928 0.3927v1.9638c0 0.216 0.1767 0.3927 0.3928 0.3927h2.3564c0.216 0 0.3928-0.1767 0.3928-0.3927v-1.9638c0-0.216-0.1768-0.3927-0.3928-0.3927zm0 2.3565h-2.3565v-1.9638h2.3565zm-1.1783-0.5892c0.216 0 0.3928-0.1767 0.3928-0.3927s-0.1768-0.3928-0.3928-0.3928-0.3927 0.1768-0.3927 0.3928 0.1767 0.3927 0.3927 0.3927z" fill={iconColor} stroke-width=".26458"/>
   <path d="m85.285 74.172h2.6086" fill="none" stroke={iconColor} stroke-linecap="round" stroke-width=".42333"/>
  </g>
 </svg>
{:else}
<svg width={finalWidth+"mm"} height={finalHeight+"mm"} version="1.1" viewBox="0 0 3.142 4.1238" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-84.459 -68.975)">
   <path d="m87.208 70.35h-0.1964v-0.3928c0-0.542-0.4399-0.9818-0.9819-0.9818s-0.9818 0.3626-0.9818 0.7657h0.3927c0-0.1314 0.2631-0.373 0.5891-0.373s0.5891 0.2632 0.5891 0.5891v0.3928h-1.7673c-0.216 0-0.3928 0.1767-0.3928 0.3927v1.9638c0 0.216 0.1768 0.3927 0.3928 0.3927h2.3565c0.216 0 0.3927-0.1767 0.3927-0.3927v-1.9638c0-0.216-0.1767-0.3927-0.3927-0.3927zm0 2.3565h-2.3565v-1.9638h2.3565zm-1.1783-0.5892c0.216 0 0.3928-0.1767 0.3928-0.3927s-0.1768-0.3928-0.3928-0.3928-0.3927 0.1768-0.3927 0.3928 0.1767 0.3927 0.3927 0.3927z" fill={iconColor} stroke-width=".26458"/>
  </g>
 </svg>
{/if}

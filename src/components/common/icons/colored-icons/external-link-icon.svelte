<svg width="{width}px" height="{height}px" version="1.1" viewBox="0 0 15 3" preserveAspectRatio=true>
  <g transform="translate(-87.448 -111.49)" stroke="{color}" stroke-linecap="round" stroke-linejoin="round">
   <path d="m95.697 116.57c0.0073 1.7851 0.19374 2.0983 0.19374 2.0983-3.5461-0.43207-7.9433 0-7.9433 0s0.4364-2.7184 0-6.2294c1.3939 0.16984 2.2115 0.20616 3.5497 0.18768" fill="none"/>
   <path d="m92.223 114.2c0.1435-0.14506 0.37672-0.39605 0.42187-0.44371 0.05359-8e-3 1.0188-0.63119 0.4624-1.9099 1.8522 0.0484 2.9529 0.0275 3.1999 0-9.38e-4 1.3243 0.05522 3.1707 0.03069 3.1683-0.85874-0.73711-1.8538 0.40231-1.8982 0.45784l-0.4525 0.41338z" fill="{color}" stroke-linejoin="round" stroke-width=".66117"/>
  </g>
 </svg>

<script lang="ts">
  export let color : string;
  export let height : number;

  $: width = (1.2030 * height).toFixed(2);
</script>
<script lang="ts">
  export let iconColor : string;
  export let width : number = 5.3337;
  export let height : number = 5.3337;
  export let scale : number = 1;
  export let hoverTransition : number = 200;

  let finalHeight;
  let finalWidth;

  $: {
    finalHeight = height * scale;
    finalWidth = width * scale;
  }
</script>

<svg class="svg-holder" style={`--hover-time: ${hoverTransition}ms`} width={finalWidth+"mm"} height={finalHeight+"mm"} version="1.1" viewBox="0 0 5.3337 5.3337" xmlns="http://www.w3.org/2000/svg">
  <path transform="scale(.26458)" d="m5.4336 0c-2.9922 0-5.4336 2.4414-5.4336 5.4336v9.293c0 2.9922 2.4414 5.4336 5.4336 5.4336h9.293c2.9922 0 5.4336-2.4414 5.4336-5.4336v-9.293c0-2.9922-2.4414-5.4336-5.4336-5.4336h-9.293zm0 2h9.293c1.9188 0 3.4336 1.5148 3.4336 3.4336v9.293c0 1.9188-1.5148 3.4336-3.4336 3.4336h-9.293c-1.9188 0-3.4336-1.5148-3.4336-3.4336v-9.293c0-1.9188 1.5148-3.4336 3.4336-3.4336zm4.6445 3.5898a1 1 0 0 0-0.99805 0.99805v2.4902h-2.4902a1 1 0 0 0-0.99805 0.99805 1 1 0 0 0 0.99805 1.0039h2.4902v2.4844a1 1 0 0 0 0.99805 1.0039 1 1 0 0 0 1.0039-1.0039v-2.4844h2.4844a1 1 0 0 0 1.0039-1.0039 1 1 0 0 0-1.0039-0.99805h-2.4844v-2.4902a1 1 0 0 0-1.0039-0.99805z" fill={iconColor} stroke-linecap="round" stroke-linejoin="round" stroke-width="3.7795" style="-inkscape-stroke:none"/>
</svg>

<style lang="scss">
  .svg-holder {
    transition: var(--hover-time) all;

    & * { 
      transition: inherit;
    }
  }

</style>
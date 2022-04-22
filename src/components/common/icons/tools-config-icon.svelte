<script lang="ts">
  export let iconColor : string;
  export let width : number = 4.3342;
  export let height : number = 4.0618;
  export let scale : number = 1;

  let finalHeight;
  let finalWidth;

  $: {
    finalHeight = height * scale;
    finalWidth = width * scale;
  }
</script>

<svg width={finalWidth+"mm"} height={finalHeight+"mm"} version="1.1" viewBox="0 0 4.3342 4.0618" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(.2189 0 0 .2189 -.45968 -.57187)" fill={iconColor} stroke-width="1.2087">
   <g fill={iconColor} stroke-width="1.2087">
    <path transform="matrix(1.2087 0 0 1.2087 2.1 2.6125)" d="m6.4375 0c-0.63497 0-1.2699 0.24258-1.7539 0.72656l-2.9297 2.9277 1.166 1.166h-2.332l-0.58789 0.58789 2.9297 2.9297 0.58594-0.58789v-2.3418l1.168 1.166 0.58594-0.58594 1.4727 1.4727-6.1309 6.1309 1.7539 1.7539 9.416-9.4082c0.29784 0.10755 0.61978 0.17383 0.95898 0.17383 1.5967 0 2.8965-1.2978 2.8965-2.8945 0-0.47985-0.13301-0.9271-0.33984-1.3242l-2.2324 2.2344-1.2344-1.2324 2.2344-2.2344c-0.39712-0.20683-0.84437-0.33984-1.3242-0.33984-1.5967 0-2.8945 1.2997-2.8945 2.8965 0 0.3392 0.066276 0.66115 0.17383 0.95898l-1.5312 1.5312-1.4727-1.4727 0.58789-0.58789-1.166-1.166 1.7539-1.7539c-0.48399-0.48399-1.1189-0.72656-1.7539-0.72656zm4.9824 8.6348-1.7539 1.7559 4.9609 4.9609 1.7539-1.7559-4.9609-4.9609z" fill={iconColor} stroke-width=".99999"/>
   </g>
  </g>
</svg>
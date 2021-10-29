import preprocess from 'svelte-preprocess';
import adapterStatic from "@sveltejs/adapter-static";
const devEnviroment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'preview';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		paths: {
			base: devEnviroment ? "" : "/build"
		},

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: adapterStatic(),
	}
};

export default config;

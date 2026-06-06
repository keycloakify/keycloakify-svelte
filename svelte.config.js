import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
    files: {
      // This is a component library (svelte-package), not a SvelteKit app.
      // app.html only exists to satisfy load_template when @sveltejs/kit (>=2.63)
      // resolves the Svelte config via vite.config.ts. Keeping it out of src/
      // prevents svelte-package from copying it into the published package.
      appTemplate: 'app.html',
    },
    alias: {
      '@keycloakify/svelte/*': 'src/*',
      '@keycloakify/svelte': 'src',
    },
  },
  vitePlugin: {
    dynamicCompileOptions: ({ filename }) => (filename.includes('node_modules') ? undefined : { runes: true }),
  },
  compilerOptions: {
    modernAst: true,
    runes: true,
  },
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      preprocess: vitePreprocess(),
      files: {
        // This is a component library (svelte-package), not a SvelteKit app.
        // app.html only exists to satisfy load_template when @sveltejs/kit
        // resolves the Svelte config via vite.config.ts. Keeping it out of src/
        // prevents svelte-package from copying it into the published package.
        appTemplate: 'app.html',
      },
      dynamicCompileOptions: ({ filename }) => (filename.includes('node_modules') ? undefined : { runes: true }),
      compilerOptions: {
        modernAst: true,
        runes: true,
      },
    }),
  ],
});

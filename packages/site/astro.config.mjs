// @ts-check
import { defineConfig } from 'astro/config';
import { ecsstatic } from '@acab/ecsstatic/vite';
import solidJs from '@astrojs/solid-js';
import alpinejs from '@astrojs/alpinejs';

import node from '@astrojs/node';

// https://astro.build/config
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
	integrations: [solidJs(), alpinejs(), svelte()],
	vite: {
		plugins: [ecsstatic()],
		optimizeDeps: {
			exclude: ['sst'],
		},
	},
	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),
});

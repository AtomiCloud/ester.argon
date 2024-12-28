// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],

  adapter: cloudflare(),
  vite: {
    ssr: {
      external: ['node:buffer', 'node:fetch'],
    },
  },
});

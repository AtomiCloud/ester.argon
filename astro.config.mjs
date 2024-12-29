// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

import icon from 'astro-icon';

export default defineConfig({
  env: {
    schema: {
      BREVO_API_KEY: envField.string({ context: 'server', access: 'secret', optional: false }),
    },
  },
  output: 'server',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    icon(),
  ],

  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  vite: {
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: import.meta.env.PROD && {
        'react-dom/server': 'react-dom/server.edge',
      },
    },
    ssr: {
      external: ['node:buffer', 'node:fetch'],
    },
  },
});

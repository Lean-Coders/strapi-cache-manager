import type { Core } from '@strapi/strapi';

const bootstrap = ({ strapi }: { strapi: Core.Strapi }) => {
  const providers = strapi.plugin('cache-manager').config('providers') as unknown[];

  if (!providers || providers.length === 0) {
    strapi.log.warn('[cache-manager] No cache providers configured. Plugin will be inactive.');
    return;
  }

  const names = (providers as Array<{ name: string }>).map((p) => p.name).join(', ');
  strapi.log.info(`[cache-manager] Initialized with ${providers.length} provider(s): ${names}`);
};

export default bootstrap;

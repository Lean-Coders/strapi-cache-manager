export default [
  {
    method: 'GET',
    path: '/providers',
    handler: 'cache-controller.getProviders',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/stats',
    handler: 'cache-controller.getStats',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/content-type-mapping',
    handler: 'cache-controller.getContentTypeMapping',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/purge-entry',
    handler: 'cache-controller.purgeEntry',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/purge-bulk',
    handler: 'cache-controller.purgeBulk',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/purge-all',
    handler: 'cache-controller.purgeAll',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];

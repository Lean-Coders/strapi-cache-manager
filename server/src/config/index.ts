export default {
  default: {
    providers: [],
    contentTypeMapping: {},
  },
  validator(config: Record<string, unknown>) {
    if (!Array.isArray(config.providers)) {
      throw new Error('cache-manager: "providers" must be an array');
    }

    for (const provider of config.providers as Record<string, unknown>[]) {
      if (!provider.name || typeof provider.name !== 'string') {
        throw new Error('cache-manager: each provider must have a "name" string');
      }
      if (!provider.type || typeof provider.type !== 'string') {
        throw new Error(`cache-manager: provider "${provider.name}" must have a "type" string`);
      }
      if (!provider.endpoints || typeof provider.endpoints !== 'object') {
        throw new Error(
          `cache-manager: provider "${provider.name}" must have an "endpoints" object`
        );
      }
    }

    if (config.contentTypeMapping && typeof config.contentTypeMapping !== 'object') {
      throw new Error('cache-manager: "contentTypeMapping" must be an object');
    }
  },
};

import type { Core } from '@strapi/strapi';

const cacheController = ({ strapi }: { strapi: Core.Strapi }) => {
  const getService = () => strapi.plugin('cache-manager').service('cache-service');

  return {
    async getProviders(ctx) {
      ctx.body = getService().getProviderSummary();
    },

    async getStats(ctx) {
      const { provider } = ctx.query;
      ctx.body = await getService().getStats(provider as string | undefined);
    },

    async getContentTypeMapping(ctx) {
      ctx.body = getService().getContentTypeMapping();
    },

    async purgeEntry(ctx) {
      const { contentTypeUid, documentId } = ctx.request.body as {
        contentTypeUid: string;
        documentId: string;
      };

      if (!contentTypeUid || !documentId) {
        return ctx.badRequest('contentTypeUid and documentId are required');
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entry = await strapi.documents(contentTypeUid as any).findOne({
          documentId,
        });

        if (!entry) {
          return ctx.notFound(`Entry not found: ${contentTypeUid} / ${documentId}`);
        }

        const results = await getService().purgeEntry(contentTypeUid, entry);

        strapi.log.info(
          `[cache-manager] Purged cache for ${contentTypeUid} / ${documentId}: ${results.filter((r) => r.success).length}/${results.length} succeeded`
        );

        ctx.body = { success: results.length > 0 && results.some((r) => r.success), results };
      } catch (error) {
        strapi.log.error(`[cache-manager] purgeEntry failed:`, error);
        return ctx.internalServerError('Failed to purge entry cache');
      }
    },

    async purgeBulk(ctx) {
      const { contentTypeUid, documentIds } = ctx.request.body as {
        contentTypeUid: string;
        documentIds: string[];
      };

      if (!contentTypeUid || !Array.isArray(documentIds) || documentIds.length === 0) {
        return ctx.badRequest('contentTypeUid and documentIds[] are required');
      }

      try {
        const entries: Record<string, unknown>[] = [];

        for (const documentId of documentIds) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const entry = await strapi.documents(contentTypeUid as any).findOne({
            documentId,
          });
          if (entry) {
            entries.push(entry);
          }
        }

        const results = await getService().purgeBulk(contentTypeUid, entries);

        strapi.log.info(
          `[cache-manager] Bulk purge for ${contentTypeUid} (${documentIds.length} entries): ${results.filter((r) => r.success).length}/${results.length} succeeded`
        );

        ctx.body = { success: results.length > 0 && results.some((r) => r.success), results };
      } catch (error) {
        strapi.log.error(`[cache-manager] purgeBulk failed:`, error);
        return ctx.internalServerError('Failed to bulk purge cache');
      }
    },

    async purgeAll(ctx) {
      const { provider } = (ctx.request.body || {}) as { provider?: string };

      try {
        const results = await getService().purgeAll(provider);

        strapi.log.info(
          `[cache-manager] Purge all${provider ? ` (${provider})` : ''}: ${results.filter((r) => r.success).length}/${results.length} succeeded`
        );

        ctx.body = { success: results.length > 0 && results.some((r) => r.success), results };
      } catch (error) {
        strapi.log.error(`[cache-manager] purgeAll failed:`, error);
        return ctx.internalServerError('Failed to purge all caches');
      }
    },
  };
};

export default cacheController;

import { getFetchClient } from '@strapi/strapi/admin';

import { PLUGIN_ID } from './pluginId';

const BASE = `/${PLUGIN_ID}`;

export const fetchProviders = async () => {
  const { get } = getFetchClient();
  const { data } = await get(`${BASE}/providers`);
  return data;
};

export const fetchStats = async (provider?: string) => {
  const { get } = getFetchClient();
  const params = provider ? `?provider=${encodeURIComponent(provider)}` : '';
  const { data } = await get(`${BASE}/stats${params}`);
  return data;
};

export const fetchContentTypeMapping = async () => {
  const { get } = getFetchClient();
  const { data } = await get(`${BASE}/content-type-mapping`);
  return data;
};

export const purgeEntry = async (contentTypeUid: string, documentId: string) => {
  const { post } = getFetchClient();
  const { data } = await post(`${BASE}/purge-entry`, { contentTypeUid, documentId });
  return data;
};

export const purgeBulk = async (contentTypeUid: string, documentIds: string[]) => {
  const { post } = getFetchClient();
  const { data } = await post(`${BASE}/purge-bulk`, { contentTypeUid, documentIds });
  return data;
};

export const purgeAll = async (provider?: string) => {
  const { post } = getFetchClient();
  const { data } = await post(`${BASE}/purge-all`, provider ? { provider } : {});
  return data;
};

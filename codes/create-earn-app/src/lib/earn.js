function getBaseUrl(env) {
  const value = env.LIFI_EARN_BASE_URL?.trim();
  return value ? value.replace(/\/+$/, '') : 'https://earn.li.fi';
}

export function buildVaultsUrl({ chainId, asset, limit, sortBy, env }) {
  const url = new URL('/v1/earn/vaults', getBaseUrl(env));
  url.searchParams.set('chainId', String(chainId));
  url.searchParams.set('asset', String(asset));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sortBy', String(sortBy));
  return url;
}

export function getEarnHeaders(env) {
  const headers = {
    Accept: 'application/json',
  };

  if (env.LIFI_API_KEY) {
    headers['x-lifi-api-key'] = env.LIFI_API_KEY;
  }

  return headers;
}

export function normalizeVaultList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.vaults)) {
    return payload.data.vaults;
  }

  if (Array.isArray(payload?.vaults)) {
    return payload.vaults;
  }

  return [];
}

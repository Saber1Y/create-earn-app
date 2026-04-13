import { buildVaultsUrl, getEarnHeaders, normalizeVaultList } from '../lib/earn.js';

function toLimit(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getMockVaults() {
  return [
    {
      name: 'Base USDC Boost',
      protocolName: 'Morpho',
      apy: 7.24,
      isTransactional: true,
    },
    {
      name: 'Stable Yield Core',
      protocolName: 'Aave',
      apy: 5.91,
      isTransactional: true,
    },
    {
      name: 'Cautious Cash',
      protocolName: 'Euler',
      apy: 4.38,
      isTransactional: false,
    },
  ];
}

function getApy(vault) {
  const apy = vault?.apy ?? vault?.currentApy ?? vault?.depositApy;
  return typeof apy === 'number' ? apy : null;
}

function formatApy(vault) {
  const apy = getApy(vault);
  if (apy === null) {
    return 'n/a';
  }

  return `${apy.toFixed(2)}%`;
}

function toOutputVault(vault) {
  const apy = getApy(vault);
  const name = vault?.name ?? vault?.symbol ?? 'Unnamed vault';
  const protocol = vault?.protocolName ?? vault?.protocol ?? 'unknown protocol';

  return {
    name,
    protocol,
    apyPercent: apy,
    isTransactional: Boolean(vault?.isTransactional),
    status: vault?.isTransactional ? 'deposit-ready' : 'view-only',
  };
}

function printTextVaults(vaults, output) {
  for (const vault of vaults) {
    const name = vault?.name ?? vault?.symbol ?? 'Unnamed vault';
    const protocol = vault?.protocolName ?? vault?.protocol ?? 'unknown protocol';
    const transactional = vault?.isTransactional ? 'deposit-ready' : 'view-only';
    output.log(`- ${name} | ${protocol} | APY ${formatApy(vault)} | ${transactional}`);
  }
}

function printJsonVaults(vaults, output, meta) {
  const data = {
    ...meta,
    count: vaults.length,
    vaults: vaults.map(toOutputVault),
  };

  output.log(JSON.stringify(data, null, 2));
}

export async function runVaults({ env, flags, output }) {
  const chainId = flags.chainId ?? flags.chain ?? '8453';
  const asset = flags.asset ?? 'USDC';
  const limit = toLimit(flags.limit, 5);
  const sortBy = flags.sortBy ?? 'apy';
  const wantsJson = Boolean(flags.json);

  if (flags.mock) {
    const mockVaults = getMockVaults().slice(0, limit);

    if (wantsJson) {
      printJsonVaults(mockVaults, output, {
        source: 'mock',
        chainId: String(chainId),
        asset: String(asset),
      });
      return;
    }

    output.log(`Using mock Earn vaults for chain ${chainId} and asset ${asset}...`);
    printTextVaults(mockVaults, output);
    return;
  }

  const url = buildVaultsUrl({ chainId, asset, limit, sortBy, env });

  output.log(`Fetching Earn vaults for chain ${chainId} and asset ${asset}...`);

  try {
    const response = await fetch(url, {
      headers: getEarnHeaders(env),
    });

    if (!response.ok) {
      output.log(`Earn API request failed with status ${response.status}`);
      return;
    }

    const payload = await response.json();
    const vaults = normalizeVaultList(payload).slice(0, limit);

    if (wantsJson) {
      printJsonVaults(vaults, output, {
        source: 'live',
        chainId: String(chainId),
        asset: String(asset),
      });
      return;
    }

    if (vaults.length === 0) {
      output.log('No vaults were returned.');
      return;
    }

    printTextVaults(vaults, output);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    output.log(`Unable to reach the Earn API: ${message}`);
    output.log('The command is wired and ready, but the network request did not complete.');
  }
}

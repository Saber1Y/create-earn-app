function checkVersionAtLeast(version, minimumMajor) {
  const [majorValue] = String(version).split('.');
  const major = Number(majorValue);
  return Number.isFinite(major) && major >= minimumMajor;
}

function formatStatus(passed) {
  return passed ? 'ok' : 'warn';
}

export async function runDoctor({ env, output }) {
  const nodeVersion = process.versions.node;
  const checks = [
    {
      label: 'Node.js >= 18',
      passed: checkVersionAtLeast(nodeVersion, 18),
      detail: `running ${nodeVersion}`,
    },
    {
      label: 'LIFI_API_KEY',
      passed: Boolean(env.LIFI_API_KEY),
      detail: env.LIFI_API_KEY ? 'found' : 'missing',
    },
    {
      label: 'LIFI_EARN_BASE_URL',
      passed: Boolean(env.LIFI_EARN_BASE_URL),
      detail: env.LIFI_EARN_BASE_URL ?? 'default https://earn.li.fi',
    },
  ];

  output.log('Earn doctor');
  for (const check of checks) {
    output.log(`- [${formatStatus(check.passed)}] ${check.label}: ${check.detail}`);
  }

  const missing = checks.filter((check) => !check.passed).map((check) => check.label);
  if (missing.length > 0) {
    output.log('');
    output.log('Next steps:');
    output.log('- Set the missing env vars before wiring the live Earn API.');
    output.log('- Run `create-earn-app vaults --chainId=8453 --asset=USDC` once you are ready.');
  }
}

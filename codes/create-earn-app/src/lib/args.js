export function parseArgs(argv) {
  const flags = {};
  const positional = [];

  for (const item of argv) {
    if (!item.startsWith('--')) {
      positional.push(item);
      continue;
    }

    const valueIndex = item.indexOf('=');
    if (valueIndex === -1) {
      flags[item.slice(2)] = true;
      continue;
    }

    const key = item.slice(2, valueIndex);
    const value = item.slice(valueIndex + 1);
    flags[key] = value === '' ? true : value;
  }

  return { flags, positional };
}

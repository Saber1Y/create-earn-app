#!/usr/bin/env node

import { runDoctor } from './commands/doctor.js';
import { runScaffold } from './commands/scaffold.js';
import { runVaults } from './commands/vaults.js';
import { parseArgs } from './lib/args.js';

const command = process.argv[2];
const parsed = parseArgs(process.argv.slice(3));
const context = {
  env: process.env,
  flags: parsed.flags,
  positional: parsed.positional,
  output: console,
};

async function main() {
  switch (command) {
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      printHelp();
      return;
    case 'doctor':
      await runDoctor(context);
      return;
    case 'vaults':
      await runVaults(context);
      return;
    case 'scaffold':
      await runScaffold(context);
      return;
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exitCode = 1;
  }
}

function printHelp() {
  console.log(`create-earn-app

Usage:
  create-earn-app <command> [options]

Commands:
  doctor     Check local setup for Earn integration work
  vaults     List Earn vaults for a chain and asset
  scaffold   Placeholder for the starter-app generator

Examples:
  create-earn-app doctor
  create-earn-app vaults --chainId=8453 --asset=USDC --limit=5
`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});

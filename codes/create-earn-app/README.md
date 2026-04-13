# create-earn-app

`create-earn-app` is a small CLI starter for building LI.FI Earn developer tooling.

## What is in here

- `doctor` checks the local setup for common integration issues.
- `vaults` lists Earn vaults for a chain and asset.
- `scaffold` is the hook for the next step: generating a starter app template.
- `vaults --mock` gives a local-only sample output for demoing the CLI.
- `vaults --json` returns machine-readable output for scripts and tooling.

## Current scope

- One stack: Node.js
- One chain target: Base by default
- One asset target: USDC by default
- One flow: discover -> inspect -> deposit-ready setup

## Next step

We will turn this into a real generator that can scaffold a working Next.js app with Earn discovery and deposit flows.

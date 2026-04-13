# create-earn-app

`create-earn-app` is a small CLI starter for building LI.FI Earn developer tooling.

## What is in here

- `doctor` checks the local setup for common integration issues.
- `vaults` lists Earn vaults for a chain and asset.
- `scaffold` generates a minimal starter app folder.
- `vaults --mock` gives a local-only sample output for demoing the CLI.
- `vaults --json` returns machine-readable output for scripts and tooling.

## Current scope

- One stack: Node.js
- One chain target: Base by default
- One asset target: USDC by default
- One flow: discover -> inspect -> deposit-ready setup

## Quick scaffold

```bash
node ./src/cli.js scaffold my-earn-app
```

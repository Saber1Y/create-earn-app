export async function runScaffold({ flags, positional, output }) {
  const name = flags.name ?? positional[0] ?? 'my-earn-app';

  output.log('Scaffold command placeholder');
  output.log(`- target app name: ${name}`);
  output.log('- next step: wire a template copier for a working Next.js Earn starter');
}

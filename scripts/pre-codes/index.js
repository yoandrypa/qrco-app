const { Command } = require('commander');

const { create, list, load, remove } = require('./actions');

const program = new Command();


program
  .name('pre-codes')
  .description('QR-Codes tools')
  .version('1.0.0')

program
  .command('generate')
  .description('Allow generate Pre-QR-Codes that will be available to be claimed.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-s, --size,      [size]', 'Set length of QR-Link code', '8')
  .requiredOption('-c, --count,     [count]', 'Set the number of codes that will be generated', '10')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .requiredOption('-a, --alphabet,  [alphabet]', 'Set the alphabet that to be used in codes generations')
  .action(create);

program
  .command('list')
  .description('Allow list the Pre-QR-Codes that will be available to be claimed.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .requiredOption('-f, --format,    [format]', 'Set response format', 'json')
  .action(list);

program
  .command('load')
  .description('Allow load from a local file, the Pre-QR-Codes that will be available to be claimed.')
  .requiredOption('-c, --count,     [count]', 'Set the number of codes that will be loaded at time', '10')
  .requiredOption('-s, --skip,      [skip]', 'Set the number of codes that will be skipped in the load', '0')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-f, --file,  [file]', 'Set the path to the file with the QR-Codes')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .action(load);

program
  .command('remove')
  .description('Allow remove the Pre-QR-Codes.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes')
  .action(remove);

program.parse();
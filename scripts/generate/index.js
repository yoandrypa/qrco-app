const { Command } = require('commander');
const program = new Command();

program
  .name('pre-generate')
  .description('QR Generator tools')
  .version('1.0.0')

program
  .command('pre-codes')
  .description('Allow pre-generate QR-Codes that will be available to be claimed.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QRApp server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-s, --size,      [size]', 'Set length of QR-Link code', '8')
  .requiredOption('-c, --count,     [count]', 'Set the number of codes that will be generated', '10')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .action(({ baseUrl, ...data }) => {
    const axios = require('axios');
    const headers = { 'Content-type': 'application/json; charset=UTF-8' };

    axios.post(`${baseUrl}/api/pre-generate`, data, { headers }).then((response) => {
      console.log(response.data);
    }).catch((err, response) => {
      console.error(err.message);
      err.response?.data && console.error(err.response.data);
    })
  });

program.parse();
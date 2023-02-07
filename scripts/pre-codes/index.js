const axios = require('axios');
const { readFileSync } = require('fs');
const { Command } = require('commander');

const program = new Command();
const headers = { 'Content-type': 'application/json; charset=UTF-8' };

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
  .action(({ baseUrl, ...data }) => {
    axios.post(`${baseUrl}/api/pre-codes`, data, { headers }).then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
    }).catch((err) => {
      console.error(err.message);
      err.response?.data && console.error(err.response.data);
    })
  });

program
  .command('list')
  .description('Allow list the Pre-QR-Codes that will be available to be claimed.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .action(({ baseUrl, owner }) => {
    const axios = require('axios');

    axios.get(`${baseUrl}/api/pre-codes?owner=${owner}`).then((response) => {
      console.log(JSON.stringify(response.data, null, 2));
    }).catch((err) => {
      console.error(err.message);
      err.response?.data && console.error(err.response.data);
    })
  });

program
  .command('load')
  .description('Allow load from a local file, the Pre-QR-Codes that will be available to be claimed.')
  .requiredOption('-u, --base-url,  [baseUrl]', 'Set QR-App server base URL', 'http://127.0.0.1:3000')
  .requiredOption('-f, --file,  [file]', 'Set the path to the file with the QR-Codes')
  .requiredOption('-o, --owner,     [owner]', 'Set the owner of codes', 'any')
  .action(async ({ baseUrl, file, owner }) => {
    const url = `${baseUrl}/api/pre-codes`;

    if (file.match(/\.(csv|json)$/)) {
      let str = readFileSync(file).toString();
      let items = file.match(/\.json$/) ? JSON.parse(str) : str.split(/[,;\n\r]+/);

      items = items.filter((item) => !!item);

      while (items.length !== 0) {
        const codes = items.splice(0, 50);

        try {
          console.log(`SENDING BLOCK OF ${codes.length} QR-Codes`);
          const response = await axios.put(url, { codes, owner }, { headers });
          if (items.length === 0) console.log(JSON.stringify(response.data, null, 2));
        } catch (err) {
          console.error(err.message);
          err.response?.data && console.error(err.response.data);
        }
      }
    } else {
      console.error('Invalid file type, only csv or json formats are allowed');
    }
  });

program.parse();
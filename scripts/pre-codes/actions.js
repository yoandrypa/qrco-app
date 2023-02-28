const axios = require('axios');
const { readFileSync } = require('fs');

const headers = { 'Content-type': 'application/json; charset=UTF-8' };

const sleep = (ms) => (new Promise((resolve) => setTimeout(resolve, ms)));

module.exports.create = async function ({ baseUrl, count, ...data }) {
  const pgSize = 20;

  let totalGenerated = 0;
  let totalCollisions = 0;

  while (count > 0) {
    try {
      data.count = Math.min(pgSize, count);
      count = count - data.count;

      console.log('--------------------------------------');
      console.log(`GENERATING BLOCK OF ${data.count} QR-Codes`);
      const response = await axios.post(`${baseUrl}/api/pre-codes`, data, { headers })

      totalGenerated += data.count;
      totalCollisions += response.data.collisions;

      console.log(`CURRENT COLLISIONS: ${response.data.collisions}`);
      console.log(`TOTAL COLLISIONS: ${totalCollisions}`);
      console.log(`TOTAL GENERATED: ${totalGenerated}`);

      if (count === 0) console.log(JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error(err.message);
      err.response?.data && console.error(err.response.data);
    } finally {
      console.log('SLEEPING 5s...');
      await sleep(5000);
    }
  }
}

module.exports.list = function ({ baseUrl, owner, format }) {
  axios.get(`${baseUrl}/api/pre-codes?owner=${owner}`).then((response) => {
    if (format === 'json') {
      console.log(JSON.stringify(response.data, null, 2));
    } else {
      console.log(response.data.codes.map((item) => item.code).join('\n'));
    }
  }).catch((err) => {
    console.error(err.message);
    err.response?.data && console.error(err.response.data);
  });
}

module.exports.load = async function ({ count, skip, baseUrl, file, owner }) {
  const url = `${baseUrl}/api/pre-codes`;

  if (file.match(/\.(csv|json)$/)) {
    let str = readFileSync(file).toString();
    let items = file.match(/\.json$/) ? JSON.parse(str) : str.split(/[,;\n\r]+/);
    let totalLoad = 0;
    let totalCollisions = 0;

    items = items.filter((item) => !!item).map((x) => x.split(/[\s\t]+/)).flat();
    items.splice(0, skip);

    while (items.length !== 0) {
      const codes = items.splice(0, count);

      try {
        console.log('--------------------------------------');
        console.log(`SENDING BLOCK OF ${codes.length} QR-Codes`);
        const response = await axios.put(url, { codes, owner }, { headers });

        totalLoad += codes.length;
        totalCollisions += response.data.collisions;

        console.log(`CURRENT COLLISIONS: ${response.data.collisions}`);
        console.log(`TOTAL COLLISIONS: ${totalCollisions}`);
        console.log(`TOTAL LOADED: ${totalLoad}`);

        if (items.length === 0) console.log(JSON.stringify(response.data, null, 2));
      } catch (err) {
        console.error(err.message);
        err.response?.data && console.error(err.response.data);
      } finally {
        console.log('SLEEPING 5s...');
        await sleep(5000);
      }
    }
  } else {
    console.error('Invalid file type, only csv or json formats are allowed');
  }
}

module.exports.remove = function ({ baseUrl, owner }) {
  axios.delete(`${baseUrl}/api/pre-codes?owner=${owner}`).then((response) => {
    console.log(JSON.stringify(response.data, null, 2));
  }).catch((err) => {
    console.error(err.message);
    err.response?.data && console.error(err.response.data);
  });
}

const handleQrs = require("./sections/handleQrs");

/**
 * HOW THIS THING WORKS?
 * node updateQrs.js accessKeyId secretAccessKey tableName userId
 *
 * IMPORTANT: the params' order is important
 */

console.log('Warming up...\n');
if (process.argv.length < 5) {
  console.log('Missing arguments. Halt.');
  return;
}

const accessKeyId = process.argv[2];
const secretAccessKey = process.argv[3];

const table = process.argv[4];
const userId = process.argv[5];

handleQrs(accessKeyId, secretAccessKey, table, userId);

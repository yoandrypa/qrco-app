const {DynamoDB, ExecuteStatementCommand} = require("@aws-sdk/client-dynamodb");
const {unmarshall} = require("@aws-sdk/util-dynamodb");
const handleQrs = require("./sections/handleQrs");

/**
 * HOW THIS THING WORKS?
 * node updateQrs.js accessKeyId secretAccessKey tableName
 *
 * IMPORTANT: the params' order is important
 */

console.log('Warming up...\n');
if (process.argv.length < 4) {
  console.log('Missing arguments. Halt.');
  return;
}

const accessKeyId = process.argv[2];
const secretAccessKey = process.argv[3];

const table = process.argv[4];

const region = "us-east-1";

console.log('Loading users...')
const client = new DynamoDB({region, credentials: {accessKeyId, secretAccessKey}});
client.send(new ExecuteStatementCommand({Statement: "SELECT userId FROM " + table}))
  .then(response => {
    if (response.Items.length) {
      const users = [];
      for (let i = 0, l = response.Items.length; i < l; i += 1) {
        const user = unmarshall(response.Items[i]).userId;
        if (!users.includes(user)) {
          users.push(user);
        }
      }
      console.log(users.length,' users loaded! Starting the conversion...')
      for (let i = 0, l = users.length; i < l; i += 1) {
        handleQrs(accessKeyId, secretAccessKey, table, users[i]);
      }
    } else {
      console.log('No users found!');
    }
  })
  .catch(error => {
    console.error('ERROR! ', error);
  });

const { DynamoDB, ExecuteStatementCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");
const handleVcard = require("./sections/handleVcard");
const handleBusiness = require("./sections/handleBusiness");
const handleLinks = require("./sections/handleLinks");
const handleAssets = require("./sections/handleAssets");
const handleSocials = require("./sections/handleSocial");

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

const region = "us-east-1";
const accessKeyId = process.argv[2];
const secretAccessKey = process.argv[3];

const table = process.argv[4];
const userId = process.argv[5];

console.log("ENTERED DATA");
console.log("============\n");
console.log("AccessKey:", accessKeyId);
console.log("SecretKey:", secretAccessKey);
console.log("Tale:", table);
console.log("User Id:", userId, '\n\n');

const client = new DynamoDB({
  region,
  credentials: { accessKeyId, secretAccessKey }
});

console.log('Loading data...');

client.send(new ExecuteStatementCommand({Statement: "SELECT * FROM " + table + " WHERE userId='" + userId + "'"}))
  .then(async (resp) => {
    console.log('Data loaded!\n');
    if (resp.Items.length) {
      for (let i = 0, l = resp.Items.length; i < l; i += 1) {
        const item = unmarshall(resp.Items[i]);
        console.log('Start processing item ' + (i + 1) + ' of ' + l + '. Type ' +  item.qrType + '...');
        if (item.custom === undefined) {

          // const newItem = handler(item, ['claimable', 'preGenerated', 'isDynamic', 'backgroundColor',
          //   'backgroundType', 'backgroundDirection', 'backgroundColorRight', 'primary', 'secondary', 'backgndImg',
          //   'foregndImg', 'foregndImgType', 'globalFont', 'buttonsFont', 'titlesFont', 'messagesFont', 'titlesFontSize',
          //   'messagesFontSize', 'buttonsFontSize', 'subtitlesFontSize', 'subtitlesFont', 'titlesFontStyle',
          //   'subtitlesFontStyle', 'messagesFontStyle', 'buttonsFontStyle', 'globalFontColor', 'buttonShape',
          //   'buttonBack', 'buttonBackColor', 'buttonBorders', 'layout', 'index', 'shortDateFormat', 'qrType',
          //   'shortLinkId', 'userId', 'qrOptionsId', 'qrName', 'createdAt', 'updatedAt']);
          //
          // newItem.custom = [];

          let custom = [];

          if (item.qrType === 'vcard+') {
            const vcardData = handleVcard(item);
            if (vcardData.length) {
              custom = vcardData;
            }
          } else if (item.qrType === 'business') {
            const business = handleBusiness(item);
            if (business.length) {
              custom = business;
            }
          } else if (item.qrType === 'link') {
            const links = handleLinks(item);
            if (links.length) {
              custom = links;
            }
          } else if (['gallery', 'pdf', 'video', 'audio'].includes(item.qrType)) {
            const assets = handleAssets(item, item.qrType);
            if (assets.length) {
              custom = assets;
            }
          } else if (item.qrType === 'social') {
            const socials = handleSocials(item, item.qrType);
            if (socials.length) {
              custom = socials;
            }
          }

          if (custom.length) {
            console.log('Attempting to update the record for item ' + (i + 1) + '...');

            const updateParams = {
              Statement: "UPDATE " + table + " SET custom='" + JSON.stringify(custom) + "' WHERE userId='" + userId + "' AND createdAt=" + item.createdAt
            }

            try {
              await client.send(new ExecuteStatementCommand(updateParams));
              console.log('Success updating item ' + (i + 1) + '!\n');
            } catch (errorUpdate) {
              console.error('Error updating item ' + (i + 1) + '!', errorUpdate, '\n');
            }
          } else {
            console.log('No data to process...\n');
          }

        } else {
          console.log('Already processed. Skipping.');
        }
      }
      console.log('Done.');
    } else {
      console.log('No items found. Halt.');
    }
  })
  .catch (err => {
    console.error('Error! ', err);
  });


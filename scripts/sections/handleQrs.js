const {DynamoDB, ExecuteStatementCommand} = require("@aws-sdk/client-dynamodb");
const {unmarshall} = require("@aws-sdk/util-dynamodb");
const handleVcard = require("./handleVcard");
const handleBusiness = require("./handleBusiness");
const handleLinks = require("./handleLinks");
const handleAssets = require("./handleAssets");
const handleSocials = require("./handleSocial");

const handleQrs = async(accessKeyId, secretAccessKey, table, userId) => {

  console.log("ENTERED DATA");
  console.log("============\n");
  console.log("AccessKey:", accessKeyId);
  console.log("SecretKey:", secretAccessKey);
  console.log("Tale:", table);
  console.log("User Id:", userId, '\n\n');

  const region = "us-east-1";

  const client = new DynamoDB({region, credentials: {accessKeyId, secretAccessKey}});

  console.log('Loading data...');

  client.send(new ExecuteStatementCommand({Statement: "SELECT * FROM " + table + " WHERE userId='" + userId + "'"}))
    .then(async (resp) => {
      console.log('Data loaded!\n');
      if (resp.Items.length) {
        for (let i = 0, l = resp.Items.length; i < l; i += 1) {
          const item = unmarshall(resp.Items[i]);
          console.log('Start processing item ' + (i + 1) + ' of ' + l + '. Type ' + item.qrType + '...');
          // if (item.custom === undefined) {

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
                Statement: "UPDATE " + table + " SET custom='" + JSON.stringify(custom).replaceAll("'","") + "' WHERE userId='" + userId + "' AND createdAt=" + item.createdAt
              }

              try {
                await client.send(new ExecuteStatementCommand(updateParams));
                console.log('Success updating item ' + (i + 1) + '!\n');
              } catch (errorUpdate) {
                console.log('Failed statement: ', updateParams.Statement);
                console.error('Error updating item ' + (i + 1) + '!', errorUpdate, '\n');
              }
            } else {
              console.log('No data to process...\n');
            }

          // } else {
          //   console.log('Already processed. Skipping.');
          // }
        }
        console.log('Done.');
      } else {
        console.log('No items found. Halt.');
      }
    })
    .catch(err => {
      console.error('Error! ', err);
    });
}

module.exports = handleQrs;

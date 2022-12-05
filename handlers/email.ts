import { SendEmailRequest } from '@aws-sdk/client-ses';
import * as AWS from 'aws-sdk'


AWS.config.update({
    region: 'us-east-1', // Change it to match your region
    credentials: {
        accessKeyId: process.env.REACT_AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.REACT_AWS_SECRET_ACCESS_KEY!,
    },
});



export async function sendEmail(from: string, to: string[], message: string, name: string) {
    const params = {
        Destination: {
            ToAddresses: to
        },
        Message: {
            Body: {
                Text: {
                    Data: "From contact: "
                }
            },
            Subject: {
                Data: "fsvfv"
            }
        },

        Source: "info@ebanux.com"
    }
    const result = await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return result;
}


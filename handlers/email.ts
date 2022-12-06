import { SendEmailRequest } from '@aws-sdk/client-ses';
import * as AWS from 'aws-sdk'

AWS.config.loadFromPath('../consts/aws-config.json');



export async function sendEmail(from: string, to: string[], message: string, subject: string, name: string) {
    const params: AWS.SES.SendEmailRequest = {
        Destination: {
            ToAddresses: to
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        },
        Source: from
    }
    const result = await new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

    return result;
}


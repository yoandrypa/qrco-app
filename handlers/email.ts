import { SendEmailRequest } from '@aws-sdk/client-ses';
import { SES } from 'aws-sdk'

const ses = new SES({ region: 'us-east-1' })

export async function sendEmail(from: string, to: string[], message: string, name: string) {
    const params: SendEmailRequest = {
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
    //@ts-ignore
    return ses.sendEmail(params).promise();
}


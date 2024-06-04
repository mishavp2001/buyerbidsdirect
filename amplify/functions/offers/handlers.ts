import { Handler } from 'aws-lambda';
const aws = require('aws-sdk')
const ses = new aws.SES()

export const handler: Handler = async (event, context) => {
    for (const streamedItem of event.Records) {
        if (streamedItem.eventName === 'INSERT') {
          //pull off items from stream
          const buyerId = streamedItem.dynamodb.Offer.seller.S
          const buyerEmail = streamedItem.dynamodb.Offer.email.S
          const buyerPhone = streamedItem.dynamodb.Offer.phone.S
          const offerAmmount = streamedItem.dynamodb.Offer.offerAmmount.S
          const propertyAddress = streamedItem.dynamodb.Offer.propertyAddress.S
          const ownerEmail = 'mishavp2001@yahoo.com'
          const ownerName = "Michael Polyakov"

          await ses
              .sendEmail({
                Destination: {
                  ToAddresses: [ownerEmail],
                },
                Source: ownerEmail,
                Message: {
                  Subject: { Data: 'You got offer' },
                  Body: {
                    Text: { Data: 
                        `Dear ${ownerName}. My name is ${buyerId}. You can reach me at ${buyerPhone} or ny email: ${buyerEmail}. 
                        I can offer ${offerAmmount} for your property at ${propertyAddress}
                        ` 
                },
                  },
                },
              })
              .promise()
        }
      }
      return { status: 'done' }
};

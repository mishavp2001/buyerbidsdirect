console.log('starting function');


import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"
import { fromEnv } from "@aws-sdk/credential-providers"

const client = new SESClient({ credentials: fromEnv() });
console.log('Client created');

export const handler = async (event: { Records: any; }, context: any) => {
    try {
   

  for (const streamedItem of event.Records) {
       console.dir(streamedItem);
      console.dir(event.Records);

    if (streamedItem.eventName === 'INSERT') {
     const buyerId = streamedItem.dynamodb.NewImage?.seller?.S || 'Unknown Buyer';
      const buyerEmail = streamedItem.dynamodb.NewImage?.email?.S || 'No email provided';
      const buyerPhone = streamedItem.dynamodb.NewImage?.phone?.S || 'No phone provided';
      const offerAmount = streamedItem.dynamodb.NewImage?.offerAmmount?.S || 'No amount specified';
      const propertyAddress = streamedItem.dynamodb.NewImage?.propertyAddress?.S || 'No address provided';
      const ownerEmail = 'mishavp2001@yahoo.com';
      const ownerName = 'Michael Polyakov';


      const command = new SendEmailCommand({
        Destination: {
          ToAddresses: ['magdreams2002@yahoo.com'],
        },
        Source: 'mishavp2001@yahoo.com',
        Message: {
          Subject: { Data: 'You got an offer' },
          Body: {
            Text: {
              Data: `Dear ${ownerName},\n\nMy name is ${buyerId}. You can reach me at ${buyerPhone} or by email at ${buyerEmail}.\nI can offer ${offerAmount} for your property at ${propertyAddress}.`,
            },
          },
        },
      });
       console.log(command);
       const response = await client.send(command);
            if (response.$metadata.httpStatusCode === 200) {
                console.log("Admin email has been sent successfully!");
            } else {
                console.error("Failed to send admin email. HTTP status code:", response.$metadata.httpStatusCode);
            }
    }
  }
  return { status: 'done' };
    } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

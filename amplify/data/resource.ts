import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/


const schema = a.schema({

  Todo: a
    .model({
      content: a.string(),
    })
    .authorization(allow => [allow.owner()]),

  UserProfile: a
    .model({
      email: a.string(),
      phone: a.string(),
      password: a.string(),
      loanApprovalLetter: a.string(),
      sellerFinancingOptions: a.string(),
      chargePerHour: a.float(),
      userType: a.enum(['buyer', 'seller', 'attorney', 'agent', 'notary']),  // Using enum for user type
    })
    .authorization(allow => [allow.owner()]),
   Offer: a
    .model({
      offerAmmount: a.integer(),
      propertyAddress: a.string(),
      propertyId: a.string(),
      buyerName: a.string(),
      buyerEmail: a.string(),
      buyerPhone: a.string(),
      ownerEmail: a.string(),
      ownerName: a.string(),
      loanApprovalLetter: a.string(), 
      offerType: a.enum(['cash', 'financing', 'sellerfinancing', 'leaseToPurchise']), 
      conditions: a.string().array(),
      appointment: a.date(),
      seller: a.string(),
      buyer: a.string()
    })
    .authorization(allow => [
      allow.ownerDefinedIn("seller").to(['read']),
      allow.ownerDefinedIn("buyer").to(['create', 'read', 'delete', 'update']),
    ]),
    
  Property: a
    .model({
      address: a.string().required(), // Using the Address model
      position: a.json().required(),
      price: a.float().required(),
      bedrooms: a.integer().required(),
      bathrooms: a.float().required(),
      squareFootage: a.integer().required(),
      lotSize: a.float().required(),
      yearBuilt: a.integer().required(),
      propertyType: a.string().required(),
      listingStatus: a.string().required(),
      listingOwner: a.string().required(),
      ownerContact: a.string().required(),
      description: a.string().required(),
      photos: a.string().array(),
      virtualTour: a.string(),
      propertyTax: a.float(),
      hoaFees: a.float(),
      mlsNumber: a.string(),
      zestimate: a.float(),
      neighborhood: a.string(),
      amenities: a.string().array(),
    })
    .authorization(
      (allow) => 
        [
          allow.authenticated('identityPool').to(['read']),
          allow.guest().to(['read']),
          allow.owner()
      ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>

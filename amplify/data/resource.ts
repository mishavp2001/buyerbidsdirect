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
      name: a.string(),
      user_role: a.enum(['owner', 'investor', 'lander', 'wholesaler', 'realtor']),
      family_name: a.string(),
      given_name: a.string(),
      middle_name: a.string(),
      nickname: a.string(),
      preferred_username: a.string(),
      profile: a.string(), // Could be a URL or descriptive text
      picture: a.string(),
      website: a.url(),
      gender: a.string(),
      birthdate: a.date(),
      zoneinfo: a.string(), // Time zone information
      locale: a.string(),
      address: a.string(),
      email: a.email().required(),
      phone_number: a.string().required(),
      favorites: a.string().array(),
      id: a.string().required(), // Cognito's unique user identifier
    }).authorization(allow => [
      allow.authenticated('identityPool').to(['read']),
      allow.guest().to(['read']),
      allow.owner()
    ]).secondaryIndexes((index) => [index("user_role")]),

  Post: a
    .model({
      name: a.string().required(),
      title: a.string().required(),
      post: a.string().required(),
      picture: a.string(),
      website: a.url(),
      email: a.email().required(),
      phone_number: a.string(),
      id: a.string().required(), // Cognito's unique user identifier
    }).authorization(allow => [
      allow.authenticated('identityPool').to(['read']),
      allow.guest().to(['read']),
      allow.owner()
    ]).secondaryIndexes((index) => [index("name")]),

  Offer: a
    .model({
      offerAmmount: a.integer().required(),
      propertyAddress: a.string(),
      propertyId: a.string().required(),
      buyerName: a.string().required(),
      buyerEmail: a.string().required(),
      buyerPhone: a.string().required(),
      ownerEmail: a.string(),
      ownerName: a.string(),
      loanApprovalLetter: a.string(),
      offerType: a.enum(['cash', 'financing', 'sellerfinancing', 'leaseToPurchise']),
      conditions: a.string().array(),
      details: a.string(),
      expires: a.date(),
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
      arvprice: a.float().required(),
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
      likes: a.integer().authorization(
        (allow) =>
          [
            allow.authenticated('identityPool').to(['read','update']),
            allow.owner()
          ])
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
      expiresInDays: 120,
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

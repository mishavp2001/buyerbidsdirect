/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOffer = /* GraphQL */ `
  query GetOffer($id: ID!) {
    getOffer(id: $id) {
      appointment
      buyer
      buyerEmail
      buyerName
      buyerPhone
      conditions
      createdAt
      details
      expires
      id
      loanApprovalLetter
      offerAmmount
      offerType
      ownerEmail
      ownerName
      propertyAddress
      propertyId
      seller
      updatedAt
      __typename
    }
  }
`;
export const getPost = /* GraphQL */ `
  query GetPost($id: String!) {
    getPost(id: $id) {
      createdAt
      email
      id
      name
      owner
      phone_number
      picture
      post
      title
      updatedAt
      website
      __typename
    }
  }
`;
export const getProperty = /* GraphQL */ `
  query GetProperty($id: ID!) {
    getProperty(id: $id) {
      address
      amenities
      arvprice
      bathrooms
      bedrooms
      createdAt
      description
      hoaFees
      id
      likes
      listingOwner
      listingStatus
      lotSize
      mlsNumber
      neighborhood
      owner
      ownerContact
      photos
      position
      price
      propertyTax
      propertyType
      squareFootage
      updatedAt
      virtualTour
      yearBuilt
      zestimate
      __typename
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: String!) {
    getUserProfile(id: $id) {
      address
      birthdate
      createdAt
      email
      family_name
      favorites
      gender
      given_name
      id
      locale
      middle_name
      name
      nickname
      owner
      phone_number
      picture
      preferred_username
      profile
      updatedAt
      user_role
      website
      zoneinfo
      __typename
    }
  }
`;
export const listOffers = /* GraphQL */ `
  query ListOffers(
    $filter: ModelOfferFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOffers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        appointment
        buyer
        buyerEmail
        buyerName
        buyerPhone
        conditions
        createdAt
        details
        expires
        id
        loanApprovalLetter
        offerAmmount
        offerType
        ownerEmail
        ownerName
        propertyAddress
        propertyId
        seller
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listPostByName = /* GraphQL */ `
  query ListPostByName(
    $filter: ModelPostFilterInput
    $limit: Int
    $name: String!
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPostByName(
      filter: $filter
      limit: $limit
      name: $name
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        email
        id
        name
        owner
        phone_number
        picture
        post
        title
        updatedAt
        website
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $id: String
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPosts(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        createdAt
        email
        id
        name
        owner
        phone_number
        picture
        post
        title
        updatedAt
        website
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listProperties = /* GraphQL */ `
  query ListProperties(
    $filter: ModelPropertyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProperties(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        address
        amenities
        arvprice
        bathrooms
        bedrooms
        createdAt
        description
        hoaFees
        id
        likes
        listingOwner
        listingStatus
        lotSize
        mlsNumber
        neighborhood
        owner
        ownerContact
        photos
        position
        price
        propertyTax
        propertyType
        squareFootage
        updatedAt
        virtualTour
        yearBuilt
        zestimate
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        content
        createdAt
        id
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUserProfileByUser_role = /* GraphQL */ `
  query ListUserProfileByUser_role(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
    $user_role: UserProfileUser_role!
  ) {
    listUserProfileByUser_role(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
      user_role: $user_role
    ) {
      items {
        address
        birthdate
        createdAt
        email
        family_name
        favorites
        gender
        given_name
        id
        locale
        middle_name
        name
        nickname
        owner
        phone_number
        picture
        preferred_username
        profile
        updatedAt
        user_role
        website
        zoneinfo
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $id: String
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUserProfiles(
      filter: $filter
      id: $id
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        address
        birthdate
        createdAt
        email
        family_name
        favorites
        gender
        given_name
        id
        locale
        middle_name
        name
        nickname
        owner
        phone_number
        picture
        preferred_username
        profile
        updatedAt
        user_role
        website
        zoneinfo
        __typename
      }
      nextToken
      __typename
    }
  }
`;

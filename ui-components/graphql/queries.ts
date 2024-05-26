/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProperty = /* GraphQL */ `
  query GetProperty($id: ID!) {
    getProperty(id: $id) {
      address
      amenities
      bathrooms
      bedrooms
      createdAt
      description
      hoaFees
      id
      listingOwner
      listingStatus
      lotSize
      mlsNumber
      neighborhood
      owner
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
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
      chargePerHour
      createdAt
      email
      id
      loanApprovalLetter
      owner
      password
      phone
      sellerFinancingOptions
      updatedAt
      userType
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
        bathrooms
        bedrooms
        createdAt
        description
        hoaFees
        id
        listingOwner
        listingStatus
        lotSize
        mlsNumber
        neighborhood
        owner
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
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        chargePerHour
        createdAt
        email
        id
        loanApprovalLetter
        owner
        password
        phone
        sellerFinancingOptions
        updatedAt
        userType
        __typename
      }
      nextToken
      __typename
    }
  }
`;

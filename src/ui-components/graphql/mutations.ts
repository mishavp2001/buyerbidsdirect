/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createOffer = /* GraphQL */ `
  mutation CreateOffer(
    $condition: ModelOfferConditionInput
    $input: CreateOfferInput!
  ) {
    createOffer(condition: $condition, input: $input) {
      appointment
      buyer
      buyerEmail
      buyerName
      buyerPhone
      conditions
      createdAt
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
export const createProperty = /* GraphQL */ `
  mutation CreateProperty(
    $condition: ModelPropertyConditionInput
    $input: CreatePropertyInput!
  ) {
    createProperty(condition: $condition, input: $input) {
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
export const createTodo = /* GraphQL */ `
  mutation CreateTodo(
    $condition: ModelTodoConditionInput
    $input: CreateTodoInput!
  ) {
    createTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: CreateUserProfileInput!
  ) {
    createUserProfile(condition: $condition, input: $input) {
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
export const deleteOffer = /* GraphQL */ `
  mutation DeleteOffer(
    $condition: ModelOfferConditionInput
    $input: DeleteOfferInput!
  ) {
    deleteOffer(condition: $condition, input: $input) {
      appointment
      buyer
      buyerEmail
      buyerName
      buyerPhone
      conditions
      createdAt
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
export const deleteProperty = /* GraphQL */ `
  mutation DeleteProperty(
    $condition: ModelPropertyConditionInput
    $input: DeletePropertyInput!
  ) {
    deleteProperty(condition: $condition, input: $input) {
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
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo(
    $condition: ModelTodoConditionInput
    $input: DeleteTodoInput!
  ) {
    deleteTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: DeleteUserProfileInput!
  ) {
    deleteUserProfile(condition: $condition, input: $input) {
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
export const updateOffer = /* GraphQL */ `
  mutation UpdateOffer(
    $condition: ModelOfferConditionInput
    $input: UpdateOfferInput!
  ) {
    updateOffer(condition: $condition, input: $input) {
      appointment
      buyer
      buyerEmail
      buyerName
      buyerPhone
      conditions
      createdAt
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
export const updateProperty = /* GraphQL */ `
  mutation UpdateProperty(
    $condition: ModelPropertyConditionInput
    $input: UpdatePropertyInput!
  ) {
    updateProperty(condition: $condition, input: $input) {
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
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $condition: ModelTodoConditionInput
    $input: UpdateTodoInput!
  ) {
    updateTodo(condition: $condition, input: $input) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $condition: ModelUserProfileConditionInput
    $input: UpdateUserProfileInput!
  ) {
    updateUserProfile(condition: $condition, input: $input) {
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

/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateOffer = /* GraphQL */ `
  subscription OnCreateOffer(
    $buyer: String
    $filter: ModelSubscriptionOfferFilterInput
    $seller: String
  ) {
    onCreateOffer(buyer: $buyer, filter: $filter, seller: $seller) {
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
export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onCreatePost(filter: $filter, owner: $owner) {
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
export const onCreateProperty = /* GraphQL */ `
  subscription OnCreateProperty(
    $filter: ModelSubscriptionPropertyFilterInput
    $owner: String
  ) {
    onCreateProperty(filter: $filter, owner: $owner) {
      address
      amenities
      arvprice
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
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onCreateUserProfile(filter: $filter, owner: $owner) {
      address
      birthdate
      createdAt
      email
      family_name
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
export const onDeleteOffer = /* GraphQL */ `
  subscription OnDeleteOffer(
    $buyer: String
    $filter: ModelSubscriptionOfferFilterInput
    $seller: String
  ) {
    onDeleteOffer(buyer: $buyer, filter: $filter, seller: $seller) {
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
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onDeletePost(filter: $filter, owner: $owner) {
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
export const onDeleteProperty = /* GraphQL */ `
  subscription OnDeleteProperty(
    $filter: ModelSubscriptionPropertyFilterInput
    $owner: String
  ) {
    onDeleteProperty(filter: $filter, owner: $owner) {
      address
      amenities
      arvprice
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
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onDeleteUserProfile(filter: $filter, owner: $owner) {
      address
      birthdate
      createdAt
      email
      family_name
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
export const onUpdateOffer = /* GraphQL */ `
  subscription OnUpdateOffer(
    $buyer: String
    $filter: ModelSubscriptionOfferFilterInput
    $seller: String
  ) {
    onUpdateOffer(buyer: $buyer, filter: $filter, seller: $seller) {
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
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $owner: String
  ) {
    onUpdatePost(filter: $filter, owner: $owner) {
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
export const onUpdateProperty = /* GraphQL */ `
  subscription OnUpdateProperty(
    $filter: ModelSubscriptionPropertyFilterInput
    $owner: String
  ) {
    onUpdateProperty(filter: $filter, owner: $owner) {
      address
      amenities
      arvprice
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
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
      content
      createdAt
      id
      owner
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $filter: ModelSubscriptionUserProfileFilterInput
    $owner: String
  ) {
    onUpdateUserProfile(filter: $filter, owner: $owner) {
      address
      birthdate
      createdAt
      email
      family_name
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

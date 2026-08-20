export const getMe = /* GraphQL */ `query GetMe {
  getMe {
    ... on Admin {
      accountStatus
      email
      firstName
      lastName
      userType
      __typename
    }
    __typename
  }
}`;

export const listAllUsers = /* GraphQL */ `query ListAllUsers($limit: Int, $nextToken: String, $userType: UserType) {
  listAllUsers(limit: $limit, nextToken: $nextToken, userType: $userType) {
    count
    nextToken
    users {
      userId
      profile {
        ... on Admin {
          accountStatus
          email
          firstName
          lastName
          userType
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}`;

// Reviewees on a survey assignment aren't necessarily ADMIN type (the team
// can include agents etc.), so unlike listAllUsers this needs to resolve
// name/email across every UserProfile variant, not just Admin.
export const getUserById = /* GraphQL */ `query GetUserById($userId: ID!) {
  getUserById(userId: $userId) {
    ... on Admin {
      email
      firstName
      lastName
      userType
      __typename
    }
    ... on Agent {
      email
      firstName
      lastName
      userType
      __typename
    }
    ... on Landlord {
      email
      firstName
      lastName
      userType
      __typename
    }
    ... on Tenant {
      email
      firstName
      lastName
      userType
      __typename
    }
    __typename
  }
}`;

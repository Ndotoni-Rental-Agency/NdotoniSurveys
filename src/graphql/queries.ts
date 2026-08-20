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

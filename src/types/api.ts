/**
 * Hand-maintained subset of the shared AppSync schema (see schema.graphql
 * in the main ndotoni-web app). Surveys only ever deals with Admin users,
 * so this intentionally does not mirror the full generated src/API.ts from
 * the main app — just the fields these pages read.
 */

export enum UserType {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  GUEST = 'GUEST',
  LANDLORD = 'LANDLORD',
  TENANT = 'TENANT',
}

export type AdminProfile = {
  __typename: 'Admin';
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userType: UserType;
  accountStatus?: string | null;
};

export type UserWithId = {
  userId: string;
  profile: AdminProfile;
};

export type UserListResponse = {
  count: number;
  nextToken?: string | null;
  users: UserWithId[];
};

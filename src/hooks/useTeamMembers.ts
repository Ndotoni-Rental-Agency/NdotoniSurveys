import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listAllUsers } from '@/graphql/queries';
import { UserListResponse, UserType } from '@/types/api';

/**
 * Trimmed stand-in for the main app's useAdmin().listUsers — surveys only
 * ever needs the list of admins to populate the reviewee picker.
 */
export function useTeamMembers() {
  const listUsers = useCallback(async (userType: UserType = UserType.ADMIN, limit = 200) => {
    const data = await GraphQLClient.executeAuthenticated<{ listAllUsers: UserListResponse }>(
      listAllUsers,
      { userType, limit }
    );
    return data.listAllUsers;
  }, []);

  return { listUsers };
}

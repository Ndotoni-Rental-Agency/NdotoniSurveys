import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listAllUsers } from '@/graphql/queries';
import { UserListResponse, UserType } from '@/types/api';
import { TeamMemberOption } from '@/types/survey';

/**
 * Full active-admin roster, used to pick who to give optional feedback to.
 * Unlike a survey assignment, there's no pre-computed list of ids to resolve
 * here, so this lists everyone up front instead of resolving one by one.
 */
export function useTeammates() {
  const listTeammates = useCallback(async (): Promise<TeamMemberOption[]> => {
    const data = await GraphQLClient.executeAuthenticated<{ listAllUsers: UserListResponse }>(
      listAllUsers,
      { userType: UserType.ADMIN, limit: 200 }
    );

    return data.listAllUsers.users.map((user) => ({
      userId: user.userId,
      name: `${user.profile.firstName ?? ''} ${user.profile.lastName ?? ''}`.trim() || user.userId,
      email: user.profile.email ?? undefined,
    }));
  }, []);

  return { listTeammates };
}

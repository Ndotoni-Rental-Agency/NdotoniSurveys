import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { getUserById } from '@/graphql/queries';
import { TeamMemberOption } from '@/types/survey';

interface UserProfileLite {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

/**
 * Reviewees on a survey assignment can be any user type (not just ADMIN),
 * so this resolves each required reviewee individually by ID rather than
 * relying on listAllUsers(userType: ADMIN), which would silently drop
 * non-admin teammates from the picker.
 */
export function useTeamMembers() {
  const getUsersByIds = useCallback(async (userIds: string[]): Promise<TeamMemberOption[]> => {
    const results = await Promise.all(
      userIds.map(async (userId): Promise<TeamMemberOption | null> => {
        try {
          const data = await GraphQLClient.executeAuthenticated<{ getUserById: UserProfileLite | null }>(
            getUserById,
            { userId }
          );
          const profile = data.getUserById;
          if (!profile) return null;

          return {
            userId,
            name: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() || userId,
            email: profile.email ?? undefined,
          };
        } catch {
          return null;
        }
      })
    );

    return results.filter((member): member is TeamMemberOption => member !== null);
  }, []);

  return { getUsersByIds };
}

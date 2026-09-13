import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { getFeedbackAboutUser, getFeedbackIGave } from '@/graphql/surveys/queries';
import { giveFeedback } from '@/graphql/surveys/mutations';
import { FeedbackRating, PeerFeedback } from '@/types/survey';

export function usePeerFeedback() {
  const submitFeedback = useCallback(
    async (input: {
      toUserId: string;
      ratings: FeedbackRating[];
      strengths: string;
      improvements: string;
      additionalFeedback?: string;
    }) => {
      const data = await GraphQLClient.executeAuthenticated<{
        giveFeedback: PeerFeedback;
      }>(giveFeedback, input);

      return data.giveFeedback;
    },
    []
  );

  const fetchFeedbackAboutUser = useCallback(async (userId: string) => {
    const data = await GraphQLClient.executeAuthenticated<{
      getFeedbackAboutUser: { feedback: PeerFeedback[]; count: number };
    }>(getFeedbackAboutUser, { userId });

    return data.getFeedbackAboutUser;
  }, []);

  const fetchFeedbackIGave = useCallback(async () => {
    const data = await GraphQLClient.executeAuthenticated<{
      getFeedbackIGave: { feedback: PeerFeedback[]; count: number };
    }>(getFeedbackIGave, {});

    return data.getFeedbackIGave;
  }, []);

  return { submitFeedback, fetchFeedbackAboutUser, fetchFeedbackIGave };
}

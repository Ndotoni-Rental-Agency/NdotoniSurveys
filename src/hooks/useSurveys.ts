import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import {
  listMySurveyAssignments,
  getSurveyStats,
} from '@/graphql/surveys/queries';
import {
  startSurveyAssignment,
  submitSurveyResponse,
} from '@/graphql/surveys/mutations';
import {
  SurveyAssignment,
  SurveyAssignmentStatus,
  SurveyRating,
  SurveyStats,
} from '@/types/survey';

export function useSurveys() {
  const fetchMyAssignments = useCallback(async (status?: SurveyAssignmentStatus) => {
    const data = await GraphQLClient.executeAuthenticated<{
      listMySurveyAssignments: { assignments: SurveyAssignment[]; count: number };
    }>(listMySurveyAssignments, { status });

    return data.listMySurveyAssignments;
  }, []);

  const fetchSurveyStats = useCallback(async (cycleMonth?: string) => {
    const data = await GraphQLClient.executeAuthenticated<{
      getSurveyStats: SurveyStats;
    }>(getSurveyStats, { cycleMonth });

    return data.getSurveyStats;
  }, []);

  const startAssignment = useCallback(async (assignmentId: string) => {
    const data = await GraphQLClient.executeAuthenticated<{
      startSurveyAssignment: SurveyAssignment;
    }>(startSurveyAssignment, { assignmentId });

    return data.startSurveyAssignment;
  }, []);

  const submitResponse = useCallback(
    async (input: {
      assignmentId: string;
      revieweeId: string;
      ratings: SurveyRating[];
      strengths: string;
      improvements: string;
      additionalFeedback?: string;
    }) => {
      const data = await GraphQLClient.executeAuthenticated<{
        submitSurveyResponse: { submittedAt: string };
      }>(submitSurveyResponse, input);

      return data.submitSurveyResponse;
    },
    []
  );

  return {
    fetchMyAssignments,
    fetchSurveyStats,
    startAssignment,
    submitResponse,
  };
}

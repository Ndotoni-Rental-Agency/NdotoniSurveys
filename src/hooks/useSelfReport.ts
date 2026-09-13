import { useCallback } from 'react';
import { GraphQLClient } from '@/lib/graphql-client';
import { listMySelfReports, getSelfReportStats } from '@/graphql/surveys/queries';
import { submitSelfReport } from '@/graphql/surveys/mutations';
import { SelfReport, SelfReportStatus, SelfReportStats } from '@/types/survey';

export function useSelfReport() {
  const fetchMyReports = useCallback(async (status?: SelfReportStatus) => {
    const data = await GraphQLClient.executeAuthenticated<{
      listMySelfReports: { reports: SelfReport[]; count: number };
    }>(listMySelfReports, { status });

    return data.listMySelfReports;
  }, []);

  const fetchSelfReportStats = useCallback(async (cycleMonth?: string) => {
    const data = await GraphQLClient.executeAuthenticated<{
      getSelfReportStats: SelfReportStats;
    }>(getSelfReportStats, { cycleMonth });

    return data.getSelfReportStats;
  }, []);

  const submitReport = useCallback(
    async (input: { cycleMonth?: string; summary: string; blockers?: string }) => {
      const data = await GraphQLClient.executeAuthenticated<{
        submitSelfReport: SelfReport;
      }>(submitSelfReport, input);

      return data.submitSelfReport;
    },
    []
  );

  return { fetchMyReports, fetchSelfReportStats, submitReport };
}

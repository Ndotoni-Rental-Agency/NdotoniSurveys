'use client';

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { SelfReportForm } from '@/components/surveys/SelfReportForm';
import { useSelfReport } from '@/hooks/useSelfReport';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { SelfReport, formatDueDate } from '@/types/survey';

function currentCycleMonth(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export default function SurveysDashboardPage() {
  const { fetchMyReports, submitReport } = useSelfReport();
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  const [reports, setReports] = useState<SelfReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPast, setShowPast] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMyReports();
      setReports(result.reports);
    } catch (err) {
      console.error('Failed to load self-reports:', err);
      setError('Failed to load your updates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cycle = currentCycleMonth();
  const currentReport = reports.find((report) => report.cycleMonth === cycle);
  const pastReports = reports
    .filter((report) => report.cycleMonth !== cycle && report.status === 'SUBMITTED')
    .sort((a, b) => (a.cycleMonth < b.cycleMonth ? 1 : -1));

  const handleSubmit = async (input: { summary: string; blockers?: string }) => {
    try {
      setIsSubmitting(true);
      await submitReport({ cycleMonth: cycle, ...input });
      showSuccess('Update submitted', 'Thanks for sharing what you worked on this month.');
      await loadData();
    } catch (err) {
      console.error('Failed to submit self-report:', err);
      showError('Submission failed', 'Could not submit your update. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Your Update</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          Tell us what you worked on this month.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="text-sm font-medium text-red-700 dark:text-red-300 hover:underline shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <Card padding="lg" className="animate-fade-up">
        {currentReport?.status === 'SUBMITTED' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircleIcon className="h-6 w-6" />
              <h2 className="text-xl font-bold tracking-tight">{currentReport.title}</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Submitted {formatDueDate(currentReport.submittedAt)}
            </p>
            <div className="space-y-3 pt-2">
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {currentReport.summary}
              </p>
              {currentReport.blockers && (
                <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap border-t border-gray-100 dark:border-gray-800 pt-3">
                  {currentReport.blockers}
                </p>
              )}
            </div>
          </div>
        ) : (
          <SelfReportForm
            title={currentReport?.title ?? 'Monthly Update'}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
      </Card>

      {pastReports.length > 0 && (
        <section className="space-y-4 animate-fade-up">
          <button
            type="button"
            onClick={() => setShowPast((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {showPast ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
            Past updates ({pastReports.length})
          </button>
          {showPast && (
            <div className="space-y-3">
              {pastReports.map((report) => (
                <Card key={report.reportId} padding="md">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 whitespace-pre-wrap">
                    {report.summary}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}

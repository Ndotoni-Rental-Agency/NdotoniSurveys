'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { SurveyAssignmentCard } from '@/components/surveys/SurveyAssignmentCard';
import { useSurveys } from '@/hooks/useSurveys';
import { SurveyAssignment } from '@/types/survey';
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

function groupAssignments(assignments: SurveyAssignment[]) {
  const now = new Date();
  const currentCycle = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

  const pending = assignments.filter((item) => item.status === 'PENDING');
  const inProgress = assignments.filter((item) => item.status === 'IN_PROGRESS');
  const completed = assignments.filter((item) => item.status === 'COMPLETED');
  const future = assignments.filter(
    (item) => item.cycleMonth > currentCycle && item.status !== 'COMPLETED'
  );

  return { pending, inProgress, completed, future };
}

export default function SurveysDashboardPage() {
  const { fetchMyAssignments } = useSurveys();
  const [assignments, setAssignments] = useState<SurveyAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMyAssignments();
      setAssignments(result.assignments);
    } catch (err) {
      console.error('Failed to load surveys:', err);
      setError('Failed to load surveys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const grouped = useMemo(() => groupAssignments(assignments), [assignments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Surveys</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Complete your assigned peer-review surveys for the team.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 flex items-center justify-between gap-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="text-sm font-medium text-red-700 dark:text-red-300 hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending"
          value={grouped.pending.length}
          icon={<ClockIcon className="h-5 w-5 text-yellow-600" />}
          iconBgColor="bg-yellow-100 dark:bg-yellow-900/20"
        />
        <StatCard
          title="In Progress"
          value={grouped.inProgress.length}
          icon={<ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-600" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
        />
        <StatCard
          title="Completed"
          value={grouped.completed.length}
          icon={<CheckCircleIcon className="h-5 w-5 text-green-600" />}
          iconBgColor="bg-green-100 dark:bg-green-900/20"
        />
        <StatCard
          title="Future"
          value={grouped.future.length}
          icon={<CalendarDaysIcon className="h-5 w-5 text-gray-600" />}
          iconBgColor="bg-gray-100 dark:bg-gray-800"
        />
      </div>

      {[
        { title: 'Pending Surveys', items: grouped.pending, empty: 'No pending surveys.' },
        { title: 'In Progress', items: grouped.inProgress, empty: 'No surveys in progress.' },
        { title: 'Completed', items: grouped.completed, empty: 'No completed surveys yet.' },
        { title: 'Future / Not Yet Available', items: grouped.future, empty: 'No upcoming surveys scheduled.' },
      ].map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h2>
          {section.items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{section.empty}</p>
          ) : (
            <div className="grid gap-3">
              {section.items.map((assignment) => (
                <SurveyAssignmentCard key={assignment.assignmentId} assignment={assignment} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

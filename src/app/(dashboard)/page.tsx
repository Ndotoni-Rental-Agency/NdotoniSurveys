'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SurveyTable, ReviewRow, reviewRowRank } from '@/components/surveys/SurveyTable';
import { AssignmentSummaryItem } from '@/components/surveys/AssignmentSummaryItem';
import { useSurveys } from '@/hooks/useSurveys';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { AuthBridge } from '@/lib/auth-bridge';
import { SurveyAssignment, TeamMemberOption, formatDueDate } from '@/types/survey';

const DUE_SOON_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type ReviewGroup = { assignment: SurveyAssignment; rows: ReviewRow[] };
type AssignmentItem = { assignment: SurveyAssignment; status: 'FUTURE' | 'COMPLETED' };
type Bucket = { reviewGroups: ReviewGroup[]; assignmentItems: AssignmentItem[] };

function isEmptyBucket(bucket: Bucket) {
  return bucket.reviewGroups.length === 0 && bucket.assignmentItems.length === 0;
}

export default function SurveysDashboardPage() {
  const { fetchMyAssignments } = useSurveys();
  const { getUsersByIds } = useTeamMembers();
  const [assignments, setAssignments] = useState<SurveyAssignment[]>([]);
  const [revieweesByAssignment, setRevieweesByAssignment] = useState<Record<string, TeamMemberOption[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    AuthBridge.getUserId().then(setCurrentUserId);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMyAssignments();
      setAssignments(result.assignments);

      // Resolve reviewees for every assignment with an actionable cycle so
      // the table can list each person individually instead of collapsing
      // the whole cycle into one row.
      const now = new Date();
      const currentCycle = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
      const needsReviewees = result.assignments.filter(
        (item) => item.status !== 'COMPLETED' && item.cycleMonth <= currentCycle
      );
      const entries = await Promise.all(
        needsReviewees.map(async (item) => [item.assignmentId, await getUsersByIds(item.requiredRevieweeIds)] as const)
      );
      setRevieweesByAssignment(Object.fromEntries(entries));
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

  const { soon, later, past } = useMemo(() => {
    const now = new Date();
    const currentCycle = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const soonCutoff = now.getTime() + DUE_SOON_WINDOW_MS;

    const soonBucket: Bucket = { reviewGroups: [], assignmentItems: [] };
    const laterBucket: Bucket = { reviewGroups: [], assignmentItems: [] };
    const pastBucket: Bucket = { reviewGroups: [], assignmentItems: [] };

    const bucketFor = (assignment: SurveyAssignment, isCompleted: boolean) => {
      if (isCompleted) return pastBucket;
      const due = new Date(assignment.dueDate ?? '').getTime();
      return !Number.isNaN(due) && due <= soonCutoff ? soonBucket : laterBucket;
    };

    for (const assignment of assignments) {
      const isFuture = assignment.status !== 'COMPLETED' && assignment.cycleMonth > currentCycle;
      const isCompleted = assignment.status === 'COMPLETED';

      if (isCompleted || isFuture) {
        bucketFor(assignment, isCompleted).assignmentItems.push({
          assignment,
          status: isFuture ? 'FUTURE' : 'COMPLETED',
        });
        continue;
      }

      const reviewees = (revieweesByAssignment[assignment.assignmentId] ?? []).filter(
        (member) => member.userId !== currentUserId
      );
      if (reviewees.length === 0) continue;

      const rows: ReviewRow[] = reviewees
        .map((reviewee) => ({
          key: `${assignment.assignmentId}:${reviewee.userId}`,
          assignment,
          reviewee,
          done: assignment.completedRevieweeIds.includes(reviewee.userId),
        }))
        .sort((a, b) => reviewRowRank(a) - reviewRowRank(b));

      bucketFor(assignment, false).reviewGroups.push({ assignment, rows });
    }

    return { soon: soonBucket, later: laterBucket, past: pastBucket };
  }, [assignments, revieweesByAssignment, currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  const isEmpty = isEmptyBucket(soon) && isEmptyBucket(later) && isEmptyBucket(past);

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Surveys</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          Complete your assigned peer-review surveys for the team.
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

      {isEmpty ? (
        <div className="animate-fade-up text-center py-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No surveys assigned to you right now.
          </p>
        </div>
      ) : (
        <>
          {!isEmptyBucket(soon) && (
            <TimeSection title="Due soon" bucket={soon} />
          )}

          {!isEmptyBucket(later) && (
            <TimeSection title="Due later" bucket={later} />
          )}

          {!isEmptyBucket(past) && (
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
                Past ({past.reviewGroups.length + past.assignmentItems.length})
              </button>
              {showPast && <BucketContent bucket={past} animate={false} />}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function TimeSection({ title, bucket }: { title: string; bucket: Bucket }) {
  return (
    <section className="space-y-4 animate-fade-up">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {title}
      </h2>
      <BucketContent bucket={bucket} />
    </section>
  );
}

function BucketContent({ bucket, animate = true }: { bucket: Bucket; animate?: boolean }) {
  return (
    <div className="space-y-6">
      {bucket.reviewGroups.map((group) => (
        <div key={group.assignment.assignmentId} className="space-y-2.5">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{group.assignment.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Due {formatDueDate(group.assignment.dueDate)} · {group.assignment.completedRevieweeIds.length} of{' '}
              {group.assignment.requiredRevieweeIds.length} reviews completed
            </p>
          </div>
          <SurveyTable rows={group.rows} animate={animate} />
        </div>
      ))}
      {bucket.assignmentItems.map((item) => (
        <AssignmentSummaryItem key={item.assignment.assignmentId} assignment={item.assignment} status={item.status} />
      ))}
    </div>
  );
}

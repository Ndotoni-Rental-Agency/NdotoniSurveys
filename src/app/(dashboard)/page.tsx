'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircleIcon,
  ClockIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { useSurveys } from '@/hooks/useSurveys';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { AuthBridge } from '@/lib/auth-bridge';
import { SurveyAssignment, TeamMemberOption, formatDueDate } from '@/types/survey';

const AVATAR_COLORS = [
  'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '').concat(parts[1]?.[0] ?? '').toUpperCase() || '?';
}

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

// One row per reviewee to review (or already reviewed) for an active
// assignment, plus one summary row for assignments with nothing to act on
// (not yet open, or every reviewee already done).
type Row =
  | { kind: 'review'; key: string; assignment: SurveyAssignment; reviewee: TeamMemberOption; done: boolean }
  | { kind: 'assignment'; key: string; assignment: SurveyAssignment; status: 'FUTURE' | 'COMPLETED' };

function rowRank(row: Row) {
  if (row.kind === 'review') return row.done ? 2 : 0;
  return row.status === 'FUTURE' ? 1 : 3;
}

export default function SurveysDashboardPage() {
  const router = useRouter();
  const { fetchMyAssignments } = useSurveys();
  const { getUsersByIds } = useTeamMembers();
  const [assignments, setAssignments] = useState<SurveyAssignment[]>([]);
  const [revieweesByAssignment, setRevieweesByAssignment] = useState<Record<string, TeamMemberOption[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const rows = useMemo<Row[]>(() => {
    const now = new Date();
    const currentCycle = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
    const result: Row[] = [];

    for (const assignment of assignments) {
      const isFuture = assignment.status !== 'COMPLETED' && assignment.cycleMonth > currentCycle;

      if (assignment.status === 'COMPLETED' || isFuture) {
        result.push({
          kind: 'assignment',
          key: assignment.assignmentId,
          assignment,
          status: isFuture ? 'FUTURE' : 'COMPLETED',
        });
        continue;
      }

      const reviewees = (revieweesByAssignment[assignment.assignmentId] ?? []).filter(
        (member) => member.userId !== currentUserId
      );
      for (const reviewee of reviewees) {
        result.push({
          kind: 'review',
          key: `${assignment.assignmentId}:${reviewee.userId}`,
          assignment,
          reviewee,
          done: assignment.completedRevieweeIds.includes(reviewee.userId),
        });
      }
    }

    return result.sort((a, b) => rowRank(a) - rowRank(b));
  }, [assignments, revieweesByAssignment, currentUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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

      {rows.length === 0 ? (
        <div className="animate-fade-up text-center py-16">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No surveys assigned to you right now.
          </p>
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden animate-fade-up">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="py-3.5 pl-5 pr-3 font-semibold">Reviewee</th>
                <th className="py-3.5 px-3 font-semibold hidden sm:table-cell">Survey</th>
                <th className="py-3.5 px-3 font-semibold hidden md:table-cell">Due</th>
                <th className="py-3.5 px-3 font-semibold">Status</th>
                <th className="py-3.5 pl-3 pr-5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {rows.map((row, index) => {
                if (row.kind === 'assignment') {
                  const isCompleted = row.status === 'COMPLETED';
                  const href = `/${row.assignment.assignmentId}`;

                  return (
                    <tr
                      key={row.key}
                      onClick={() => router.push(href)}
                      className="animate-fade-up cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="py-3.5 pl-5 pr-3" colSpan={2}>
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {isCompleted ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-600" />
                            ) : (
                              <ClockIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white truncate">{row.assignment.title}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 hidden md:table-cell text-gray-500 dark:text-gray-400">
                        {formatDueDate(row.assignment.dueDate)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                          isCompleted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {isCompleted ? 'Completed' : 'Not yet available'}
                        </span>
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right">
                        <Link
                          href={href}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 group"
                        >
                          View
                          <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                }

                const href = `/${row.assignment.assignmentId}?reviewee=${row.reviewee.userId}`;

                return (
                  <tr
                    key={row.key}
                    onClick={() => !row.done && router.push(href)}
                    className={`animate-fade-up transition-colors ${
                      row.done ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="py-3 pl-5 pr-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColor(row.reviewee.name)}`}
                        >
                          {initials(row.reviewee.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{row.reviewee.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate sm:hidden">
                            {row.assignment.title}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden sm:table-cell text-gray-500 dark:text-gray-400 truncate max-w-[14rem]">
                      {row.assignment.title}
                    </td>
                    <td className="py-3 px-3 hidden md:table-cell text-gray-500 dark:text-gray-400">
                      {formatDueDate(row.assignment.dueDate)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                        row.done
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {row.done ? 'Reviewed' : 'Needs review'}
                      </span>
                    </td>
                    <td className="py-3 pl-3 pr-5 text-right">
                      {row.done ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 inline-block" />
                      ) : (
                        <Link
                          href={href}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 group"
                        >
                          Review
                          <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { SurveyAssignment, TeamMemberOption } from '@/types/survey';

// One row per reviewee to review (or already reviewed) within a single
// assignment — the table is always scoped to one survey, shown as a
// heading above it, so there's no need to repeat the survey name per row.
export interface ReviewRow {
  key: string;
  assignment: SurveyAssignment;
  reviewee: TeamMemberOption;
  done: boolean;
}

export function reviewRowRank(row: ReviewRow) {
  return row.done ? 1 : 0;
}

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

interface SurveyTableProps {
  rows: ReviewRow[];
  animate?: boolean;
}

export function SurveyTable({ rows, animate = true }: SurveyTableProps) {
  const router = useRouter();

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed min-w-[320px]">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <th className="py-3.5 pl-5 pr-4 font-semibold">Reviewee</th>
              <th className="py-3.5 px-4 font-semibold w-36">Status</th>
              <th className="py-3.5 pl-4 pr-5 font-semibold text-right w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {rows.map((row, index) => {
              const delay = animate ? { animationDelay: `${index * 30}ms` } : undefined;
              const animCls = animate ? 'animate-fade-up' : '';
              const href = `/${row.assignment.assignmentId}?reviewee=${row.reviewee.userId}`;

              return (
                <tr
                  key={row.key}
                  onClick={() => !row.done && router.push(href)}
                  className={`${animCls} transition-colors ${
                    row.done ? 'opacity-60' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60'
                  }`}
                  style={delay}
                >
                  <td className="py-3 pl-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColor(row.reviewee.name)}`}
                      >
                        {initials(row.reviewee.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{row.reviewee.name}</p>
                        {row.reviewee.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{row.reviewee.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-full ${
                      row.done
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {row.done ? 'Reviewed' : 'Needs review'}
                    </span>
                  </td>
                  <td className="py-3 pl-4 pr-5 text-right">
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
      </div>
    </Card>
  );
}

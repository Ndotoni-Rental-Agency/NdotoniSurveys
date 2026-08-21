'use client';

import Link from 'next/link';
import { CheckCircleIcon, ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { SurveyAssignment, formatDueDate } from '@/types/survey';

interface AssignmentSummaryItemProps {
  assignment: SurveyAssignment;
  status: 'FUTURE' | 'COMPLETED';
}

export function AssignmentSummaryItem({ assignment, status }: AssignmentSummaryItemProps) {
  const isCompleted = status === 'COMPLETED';
  const href = `/${assignment.assignmentId}`;

  return (
    <Card padding="none" className="overflow-hidden">
      <Link href={href} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
        <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          {isCompleted ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
          ) : (
            <ClockIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{assignment.title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Due {formatDueDate(assignment.dueDate)}</p>
        </div>
        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
          isCompleted
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
        }`}>
          {isCompleted ? 'Completed' : 'Not yet available'}
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
          View
          <ChevronRightIcon className="h-4 w-4" />
        </span>
      </Link>
    </Card>
  );
}

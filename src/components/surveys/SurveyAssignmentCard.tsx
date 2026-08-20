'use client';

import Link from 'next/link';
import { ChevronRightIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import {
  SurveyAssignment,
  formatDueDate,
  getProgressLabel,
  getStatusColor,
} from '@/types/survey';

interface SurveyAssignmentCardProps {
  assignment: SurveyAssignment;
  actionLabel?: string;
  index?: number;
}

export function SurveyAssignmentCard({ assignment, actionLabel, index = 0 }: SurveyAssignmentCardProps) {
  const isActionable = assignment.status === 'PENDING' || assignment.status === 'IN_PROGRESS';
  const label = actionLabel ?? (isActionable ? 'Continue' : 'View');

  return (
    <Link
      href={`/${assignment.assignmentId}`}
      className="group flex items-center gap-4 py-4 -mx-2 px-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="h-10 w-10 shrink-0 rounded-full bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center">
        <ClipboardDocumentCheckIcon className="h-5 w-5 text-brand-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {assignment.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
            {assignment.status.replace('_', ' ')}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Due {formatDueDate(assignment.dueDate)} · {getProgressLabel(assignment)}
          </span>
        </div>
      </div>

      <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700 group-hover:translate-x-0.5 transition-transform shrink-0">
        {label}
        <ChevronRightIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { ChevronRightIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Card, CardContent } from '@/components/ui/Card';
import {
  SurveyAssignment,
  formatDueDate,
  getProgressLabel,
  getStatusColor,
} from '@/types/survey';

interface SurveyAssignmentCardProps {
  assignment: SurveyAssignment;
  actionLabel?: string;
}

export function SurveyAssignmentCard({ assignment, actionLabel }: SurveyAssignmentCardProps) {
  const isActionable = assignment.status === 'PENDING' || assignment.status === 'IN_PROGRESS';
  const label = actionLabel ?? (isActionable ? 'Continue' : 'View');

  return (
    <Link
      href={`/${assignment.assignmentId}`}
      className="block group"
    >
      <Card padding="none" className="hover:shadow-soft hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardDocumentCheckIcon className="h-5 w-5 text-brand-600 shrink-0" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {assignment.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                  {assignment.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Due {formatDueDate(assignment.dueDate)}
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-300">
                {getProgressLabel(assignment)}
              </p>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:text-brand-700 shrink-0">
              {label}
              <ChevronRightIcon className="h-4 w-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

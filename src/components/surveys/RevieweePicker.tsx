'use client';

import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { TeamMemberOption } from '@/types/survey';
import { Card, CardContent } from '@/components/ui/Card';

interface RevieweePickerProps {
  members: TeamMemberOption[];
  completedRevieweeIds: string[];
  onSelect: (member: TeamMemberOption) => void;
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

export function RevieweePicker({
  members,
  completedRevieweeIds,
  onSelect,
}: RevieweePickerProps) {
  const availableMembers = members.filter(
    (member) => !completedRevieweeIds.includes(member.userId)
  );

  if (availableMembers.length === 0) {
    return (
      <Card padding="none">
        <CardContent className="p-8 text-center space-y-3">
          <CheckCircleIcon className="h-10 w-10 text-green-600 mx-auto" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have completed reviews for all assigned team members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Who would you like to review?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Select a teammate to open their survey.
        </p>
      </div>

      <div className="grid gap-2.5">
        {availableMembers.map((member) => (
          <button
            key={member.userId}
            type="button"
            onClick={() => onSelect(member)}
            className="group flex items-center gap-4 text-left rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-soft transition-all"
          >
            <div
              className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${avatarColor(member.name)}`}
            >
              {initials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
              {member.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
              )}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import { TeamMemberOption } from '@/types/survey';
import { Card, CardContent } from '@/components/ui/Card';

interface RevieweePickerProps {
  members: TeamMemberOption[];
  completedRevieweeIds: string[];
  onSelect: (member: TeamMemberOption) => void;
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
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            You have completed reviews for all assigned team members.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Which team member would you like to review?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Select a teammate to open the survey form.
        </p>
      </div>

      <div className="grid gap-3">
        {availableMembers.map((member) => (
          <button
            key={member.userId}
            type="button"
            onClick={() => onSelect(member)}
            className="text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-brand-400 hover:shadow-sm transition-all"
          >
            <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
            {member.email && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{member.email}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

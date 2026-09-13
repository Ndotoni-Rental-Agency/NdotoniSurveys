'use client';

import { ChevronRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { TeamMemberOption } from '@/types/survey';

interface TeammatePickerProps {
  members: TeamMemberOption[];
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

export function TeammatePicker({ members, onSelect }: TeammatePickerProps) {
  if (members.length === 0) {
    return (
      <div className="animate-fade-up text-center py-16">
        <UserGroupIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-300">
          No teammates to give feedback to right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Who would you like to give feedback to?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Optional — give a shoutout or constructive feedback to any teammate, anytime.
        </p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {members.map((member, index) => (
          <button
            key={member.userId}
            type="button"
            onClick={() => onSelect(member)}
            className="group w-full flex items-center gap-4 text-left py-3.5 -mx-2 px-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors animate-fade-up"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div
              className={`h-11 w-11 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold transition-transform group-hover:scale-105 ${avatarColor(member.name)}`}
            >
              {initials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">{member.name}</p>
              {member.email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
              )}
            </div>
            <ChevronRightIcon className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

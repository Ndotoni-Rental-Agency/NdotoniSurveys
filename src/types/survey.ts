export type SelfReportStatus = 'PENDING' | 'SUBMITTED';

export interface SelfReport {
  reportId: string;
  userId: string;
  cycleMonth: string;
  title: string;
  status: SelfReportStatus;
  summary?: string | null;
  blockers?: string | null;
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  submittedAt?: string | null;
}

export interface SelfReportStats {
  totalReports: number;
  submitted: number;
  pending: number;
  completionRate: number;
}

export interface FeedbackRating {
  category: string;
  score: number;
}

export interface PeerFeedback {
  feedbackId: string;
  fromUserId: string;
  toUserId: string;
  ratings: FeedbackRating[];
  strengths: string;
  improvements: string;
  additionalFeedback?: string | null;
  createdAt: string;
}

export interface TeamMemberOption {
  userId: string;
  name: string;
  email?: string;
}

export const FEEDBACK_RATING_CATEGORIES = [
  'Communication',
  'Technical Skill',
  'Teamwork',
  'Problem Solving',
  'Reliability',
] as const;

export const MIN_RATING_SCORE = 1;
export const MAX_RATING_SCORE = 10;

export function getStatusColor(status: SelfReportStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'SUBMITTED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  }
}

export function formatDueDate(dueDate?: string | null): string {
  if (!dueDate) return 'No deadline';
  return new Date(dueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

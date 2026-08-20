export type SurveyAssignmentStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';

export interface SurveyRating {
  category: string;
  score: number;
}

export interface SurveyAssignment {
  assignmentId: string;
  reviewerId: string;
  cycleMonth: string;
  title: string;
  status: SurveyAssignmentStatus;
  requiredRevieweeIds: string[];
  completedRevieweeIds: string[];
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface SurveyResponse {
  assignmentId: string;
  reviewerId: string;
  revieweeId: string;
  cycleMonth: string;
  ratings: SurveyRating[];
  strengths: string;
  improvements: string;
  additionalFeedback?: string | null;
  submittedAt: string;
}

export interface SurveyStats {
  totalAssignments: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export interface TeamMemberOption {
  userId: string;
  name: string;
  email?: string;
}

export const SURVEY_RATING_CATEGORIES = [
  'Communication',
  'Technical Skill',
  'Teamwork',
  'Problem Solving',
  'Reliability',
] as const;

export const MIN_RATING_SCORE = 1;
export const MAX_RATING_SCORE = 10;

export function getStatusColor(status: SurveyAssignmentStatus): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

export function getProgressLabel(assignment: SurveyAssignment): string {
  const total = assignment.requiredRevieweeIds.length;
  const done = assignment.completedRevieweeIds.length;
  return `${done} of ${total} reviews completed`;
}

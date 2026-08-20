'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useSurveys } from '@/hooks/useSurveys';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { RevieweePicker } from '@/components/surveys/RevieweePicker';
import { SurveyForm } from '@/components/surveys/SurveyForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  SurveyAssignment,
  TeamMemberOption,
  getProgressLabel,
} from '@/types/survey';
import { UserType } from '@/types/api';
import { AuthBridge } from '@/lib/auth-bridge';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

type WorkflowStep = 'loading' | 'picker' | 'form' | 'complete';

export default function SurveyWorkflowPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;
  const { listUsers } = useTeamMembers();
  const { fetchMyAssignments, startAssignment, submitResponse } = useSurveys();
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  const [assignment, setAssignment] = useState<SurveyAssignment | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([]);
  const [selectedReviewee, setSelectedReviewee] = useState<TeamMemberOption | null>(null);
  const [step, setStep] = useState<WorkflowStep>('loading');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // The getMe profile has no userId field in the schema — read the real
  // Cognito sub directly instead.
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    AuthBridge.getUserId().then(setCurrentUserId);
  }, []);

  const eligibleMembers = useMemo(() => {
    if (!assignment || !currentUserId) return teamMembers;

    return teamMembers.filter(
      (member) =>
        member.userId !== currentUserId &&
        assignment.requiredRevieweeIds.includes(member.userId)
    );
  }, [assignment, currentUserId, teamMembers]);

  const loadPage = async () => {
    try {
      setError(null);
      setStep('loading');

      const [assignmentsResult, usersResult] = await Promise.all([
        fetchMyAssignments(),
        listUsers(UserType.ADMIN, 200),
      ]);

      const foundAssignment = assignmentsResult.assignments.find(
        (item) => item.assignmentId === assignmentId
      );

      if (!foundAssignment) {
        setError('Survey assignment not found.');
        setStep('picker');
        return;
      }

      let activeAssignment = foundAssignment;
      if (foundAssignment.status === 'PENDING') {
        activeAssignment = await startAssignment(foundAssignment.assignmentId);
      }

      const admins = usersResult.users.map((entry) => ({
        userId: entry.userId,
        name: `${entry.profile?.firstName ?? ''} ${entry.profile?.lastName ?? ''}`.trim() || entry.userId,
        email: entry.profile?.email ?? undefined,
      }));

      setAssignment(activeAssignment);
      setTeamMembers(admins);

      if (activeAssignment.status === 'COMPLETED') {
        setStep('complete');
      } else {
        setStep('picker');
      }
    } catch (err) {
      console.error('Failed to load survey workflow:', err);
      setError('Failed to load survey. Please try again.');
      setStep('picker');
    }
  };

  useEffect(() => {
    if (assignmentId) {
      loadPage();
    }
  }, [assignmentId]);

  const handleSubmit = async (input: {
    ratings: { category: string; score: number }[];
    strengths: string;
    improvements: string;
    additionalFeedback?: string;
  }) => {
    if (!assignment || !selectedReviewee) return;

    try {
      setIsSubmitting(true);
      await submitResponse({
        assignmentId: assignment.assignmentId,
        revieweeId: selectedReviewee.userId,
        ...input,
      });

      showSuccess('Review submitted', `Your review for ${selectedReviewee.name} was saved.`);

      const refreshed = await fetchMyAssignments();
      const updatedAssignment = refreshed.assignments.find(
        (item) => item.assignmentId === assignment.assignmentId
      );

      if (!updatedAssignment) {
        setStep('complete');
        return;
      }

      setAssignment(updatedAssignment);
      setSelectedReviewee(null);

      if (updatedAssignment.status === 'COMPLETED') {
        setStep('complete');
      } else {
        setStep('picker');
      }
    } catch (err) {
      console.error('Failed to submit survey response:', err);
      showError('Submission failed', 'Could not submit your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Surveys
          </Button>
        </Link>
      </div>

      {assignment && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{assignment.title}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {getProgressLabel(assignment)}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {step === 'complete' && assignment && (
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircleIcon className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Survey Complete
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                You have submitted all required reviews for {assignment.title}.
              </p>
            </div>
            <Link href="/">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {step === 'picker' && assignment && (
        <RevieweePicker
          members={eligibleMembers}
          completedRevieweeIds={assignment.completedRevieweeIds}
          onSelect={(member) => {
            setSelectedReviewee(member);
            setStep('form');
          }}
        />
      )}

      {step === 'form' && assignment && selectedReviewee && (
        <SurveyForm
          reviewee={selectedReviewee}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onBack={() => {
            setSelectedReviewee(null);
            setStep('picker');
          }}
        />
      )}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}

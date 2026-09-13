'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTeammates } from '@/hooks/useTeammates';
import { usePeerFeedback } from '@/hooks/usePeerFeedback';
import { useNotification } from '@/hooks/useNotification';
import { NotificationModal } from '@/components/ui/NotificationModal';
import { TeammatePicker } from '@/components/surveys/TeammatePicker';
import { PeerFeedbackForm } from '@/components/surveys/PeerFeedbackForm';
import { AuthBridge } from '@/lib/auth-bridge';
import { FeedbackRating, TeamMemberOption } from '@/types/survey';

type Step = 'loading' | 'picker' | 'form';

export default function GiveFeedbackPage() {
  const { listTeammates } = useTeammates();
  const { submitFeedback } = usePeerFeedback();
  const { notification, showSuccess, showError, closeNotification } = useNotification();

  const [teammates, setTeammates] = useState<TeamMemberOption[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const [recipient, setRecipient] = useState<TeamMemberOption | null>(null);
  const [step, setStep] = useState<Step>('loading');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AuthBridge.getUserId().then(setCurrentUserId);
  }, []);

  const loadTeammates = async () => {
    try {
      setError(null);
      setStep('loading');
      const members = await listTeammates();
      setTeammates(members);
      setStep('picker');
    } catch (err) {
      console.error('Failed to load teammates:', err);
      setError('Failed to load teammates. Please try again.');
      setStep('picker');
    }
  };

  useEffect(() => {
    loadTeammates();
  }, []);

  const eligibleMembers = useMemo(
    () => teammates.filter((member) => member.userId !== currentUserId),
    [teammates, currentUserId]
  );

  const handleSubmit = async (input: {
    ratings: FeedbackRating[];
    strengths: string;
    improvements: string;
    additionalFeedback?: string;
  }) => {
    if (!recipient) return;

    try {
      setIsSubmitting(true);
      await submitFeedback({ toUserId: recipient.userId, ...input });
      showSuccess('Feedback sent', `Your feedback for ${recipient.name} was saved.`);
      setRecipient(null);
      setStep('picker');
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      showError('Submission failed', 'Could not submit your feedback. Please try again.');
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {step === 'picker' && (
        <TeammatePicker
          members={eligibleMembers}
          onSelect={(member) => {
            setRecipient(member);
            setStep('form');
          }}
        />
      )}

      {step === 'form' && recipient && (
        <PeerFeedbackForm
          recipient={recipient}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onBack={() => {
            setRecipient(null);
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

'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { RatingScaleField } from './RatingScaleField';
import {
  SURVEY_RATING_CATEGORIES,
  SurveyRating,
  TeamMemberOption,
} from '@/types/survey';

interface SurveyFormProps {
  reviewee: TeamMemberOption;
  isSubmitting: boolean;
  onSubmit: (input: {
    ratings: SurveyRating[];
    strengths: string;
    improvements: string;
    additionalFeedback?: string;
  }) => Promise<void>;
  onBack: () => void;
}

type TextField = 'strengths' | 'improvements' | 'additionalFeedback';

type Step =
  | { kind: 'rating'; category: (typeof SURVEY_RATING_CATEGORIES)[number] }
  | { kind: 'text'; field: TextField; title: string; helper: string; placeholder: string; required: boolean };

const TEXT_STEPS: Extract<Step, { kind: 'text' }>[] = [
  {
    kind: 'text',
    field: 'strengths',
    title: 'What are their strengths?',
    helper: 'What does this person do particularly well?',
    placeholder: 'e.g. Always communicates blockers early and helps unblock teammates...',
    required: true,
  },
  {
    kind: 'text',
    field: 'improvements',
    title: 'Where could they improve?',
    helper: 'Be specific and constructive.',
    placeholder: 'e.g. Could delegate more instead of taking on everything themselves...',
    required: true,
  },
  {
    kind: 'text',
    field: 'additionalFeedback',
    title: 'Anything else to add?',
    helper: 'Optional — any other feedback for this review.',
    placeholder: 'Optional comments...',
    required: false,
  },
];

const STEPS: Step[] = [
  ...SURVEY_RATING_CATEGORIES.map((category) => ({ kind: 'rating' as const, category })),
  ...TEXT_STEPS,
];

export function SurveyForm({ reviewee, isSubmitting, onSubmit, onBack }: SurveyFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const directionRef = useRef<1 | -1>(1);
  const [ratings, setRatings] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(SURVEY_RATING_CATEGORIES.map((category) => [category, null]))
  );
  const [text, setText] = useState<Record<TextField, string>>({
    strengths: '',
    improvements: '',
    additionalFeedback: '',
  });

  const step = STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;

  const canAdvance = useMemo(() => {
    if (step.kind === 'rating') return ratings[step.category] != null;
    if (!step.required) return true;
    return text[step.field].trim().length > 0;
  }, [step, ratings, text]);

  const goNext = async () => {
    if (!canAdvance) return;

    if (!isLastStep) {
      directionRef.current = 1;
      setStepIndex((i) => i + 1);
      return;
    }

    await onSubmit({
      ratings: SURVEY_RATING_CATEGORIES.map((category) => ({
        category,
        score: ratings[category]!,
      })),
      strengths: text.strengths.trim(),
      improvements: text.improvements.trim(),
      additionalFeedback: text.additionalFeedback.trim() || undefined,
    });
  };

  const goBack = () => {
    if (isFirstStep) {
      onBack();
      return;
    }
    directionRef.current = -1;
    setStepIndex((i) => i - 1);
  };

  return (
    <div>
      <div className="mb-8">
        <ProgressBar
          current={stepIndex + 1}
          total={STEPS.length}
          label={`Reviewing ${reviewee.name}`}
        />
      </div>

      <div
        key={stepIndex}
        className="animate-step-in min-h-[300px] flex flex-col justify-center"
        style={{ '--step-offset': `${directionRef.current * 16}px` } as React.CSSProperties}
      >
        {step.kind === 'rating' ? (
          <div className="space-y-7">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {step.category}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                How would you rate {reviewee.name} on this?
              </p>
            </div>
            <RatingScaleField
              category={step.category}
              value={ratings[step.category]}
              onChange={(score) =>
                setRatings((current) => ({ ...current, [step.category]: score }))
              }
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{step.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{step.helper}</p>
            </div>
            <textarea
              autoFocus
              value={text[step.field]}
              onChange={(event) =>
                setText((current) => ({ ...current, [step.field]: event.target.value }))
              }
              rows={5}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
              placeholder={step.placeholder}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
        <Button type="button" variant="ghost" onClick={goBack} disabled={isSubmitting}>
          <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
          Back
        </Button>
        <Button type="button" onClick={goNext} disabled={!canAdvance} loading={isSubmitting}>
          {isLastStep ? 'Submit Review' : 'Next'}
          {!isLastStep && <ArrowRightIcon className="h-4 w-4 ml-1.5" />}
        </Button>
      </div>
    </div>
  );
}

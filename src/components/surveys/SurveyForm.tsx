'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
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

export function SurveyForm({ reviewee, isSubmitting, onSubmit, onBack }: SurveyFormProps) {
  const [ratings, setRatings] = useState<Record<string, number | null>>(() =>
    Object.fromEntries(SURVEY_RATING_CATEGORIES.map((category) => [category, null]))
  );
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    const missingCategory = SURVEY_RATING_CATEGORIES.find(
      (category) => ratings[category] == null
    );
    if (missingCategory) {
      setError(`Please provide a rating for ${missingCategory}.`);
      return;
    }
    if (!strengths.trim()) {
      setError('Please describe this person\'s strengths.');
      return;
    }
    if (!improvements.trim()) {
      setError('Please describe areas for improvement.');
      return;
    }

    await onSubmit({
      ratings: SURVEY_RATING_CATEGORIES.map((category) => ({
        category,
        score: ratings[category]!,
      })),
      strengths: strengths.trim(),
      improvements: improvements.trim(),
      additionalFeedback: additionalFeedback.trim() || undefined,
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reviewing {reviewee.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Rate your teammate and provide constructive feedback.
            </p>
          </div>

          <div className="space-y-5">
            {SURVEY_RATING_CATEGORIES.map((category) => (
              <RatingScaleField
                key={category}
                category={category}
                value={ratings[category]}
                onChange={(score) =>
                  setRatings((current) => ({ ...current, [category]: score }))
                }
              />
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Strengths
              </label>
              <textarea
                value={strengths}
                onChange={(event) => setStrengths(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                placeholder="What does this person do well?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Areas for Improvement
              </label>
              <textarea
                value={improvements}
                onChange={(event) => setImprovements(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                placeholder="How could this person improve?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Additional Feedback
              </label>
              <textarea
                value={additionalFeedback}
                onChange={(event) => setAdditionalFeedback(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                placeholder="Any additional comments?"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Submit Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

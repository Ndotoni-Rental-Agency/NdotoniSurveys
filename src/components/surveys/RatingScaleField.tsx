'use client';

import { MAX_RATING_SCORE } from '@/types/survey';

interface RatingScaleFieldProps {
  category: string;
  value: number | null;
  onChange: (score: number) => void;
}

export function RatingScaleField({ category, value, onChange }: RatingScaleFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        {category}
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        {Array.from({ length: MAX_RATING_SCORE }, (_, index) => {
          const score = index + 1;
          const selected = value === score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`h-8 w-8 rounded-full border text-xs font-medium transition-colors ${
                selected
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-brand-400'
              }`}
              aria-label={`${category}: ${score}`}
            >
              {score}
            </button>
          );
        })}
      </div>
    </div>
  );
}

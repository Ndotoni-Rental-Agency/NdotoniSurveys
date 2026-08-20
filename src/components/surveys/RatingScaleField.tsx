'use client';

import { MAX_RATING_SCORE, MIN_RATING_SCORE } from '@/types/survey';

interface RatingScaleFieldProps {
  category: string;
  value: number | null;
  onChange: (score: number) => void;
}

export function RatingScaleField({ category, value, onChange }: RatingScaleFieldProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
        {Array.from({ length: MAX_RATING_SCORE }, (_, index) => {
          const score = index + 1;
          const selected = value === score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`aspect-square rounded-2xl border-2 text-lg font-semibold transition-all duration-150 ${
                selected
                  ? 'bg-brand-600 border-brand-600 text-white shadow-green-sm scale-105'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10'
              }`}
              aria-label={`${category}: ${score}`}
              aria-pressed={selected}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500 px-1">
        <span>{MIN_RATING_SCORE} · Needs improvement</span>
        <span>{MAX_RATING_SCORE} · Outstanding</span>
      </div>
    </div>
  );
}

'use client';

import { MAX_RATING_SCORE, MIN_RATING_SCORE } from '@/types/survey';

interface RatingScaleFieldProps {
  category: string;
  value: number | null;
  onChange: (score: number) => void;
}

export function RatingScaleField({ category, value, onChange }: RatingScaleFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 sm:gap-1.5">
        {Array.from({ length: MAX_RATING_SCORE }, (_, index) => {
          const score = index + 1;
          const selected = value === score;

          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              className={`flex-1 h-12 sm:h-16 rounded-lg sm:rounded-xl border text-sm sm:text-base font-semibold transition-all duration-150 active:scale-90 ${
                selected
                  ? 'bg-brand-600 border-brand-600 text-white shadow-green-sm scale-110 z-10'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/10'
              }`}
              aria-label={`${category}: ${score}`}
              aria-pressed={selected}
            >
              {score}
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-xs font-medium text-gray-400 dark:text-gray-500 px-0.5">
        <span>{MIN_RATING_SCORE} · Needs improvement</span>
        <span>{MAX_RATING_SCORE} · Outstanding</span>
      </div>
    </div>
  );
}

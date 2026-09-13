'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface SelfReportFormProps {
  title: string;
  initialSummary?: string;
  initialBlockers?: string;
  isSubmitting: boolean;
  onSubmit: (input: { summary: string; blockers?: string }) => Promise<void>;
}

export function SelfReportForm({
  title,
  initialSummary = '',
  initialBlockers = '',
  isSubmitting,
  onSubmit,
}: SelfReportFormProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [blockers, setBlockers] = useState(initialBlockers);

  const canSubmit = summary.trim().length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          What did you work on this month?
        </p>
      </div>

      <div className="space-y-4">
        <textarea
          autoFocus
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          rows={6}
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
          placeholder="e.g. Shipped the new booking flow, closed 12 support tickets, ran onboarding for two new landlords..."
        />

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Anything blocking you, or plans for next month?{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </p>
          <textarea
            value={blockers}
            onChange={(event) => setBlockers(event.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors"
            placeholder="Optional..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="button"
          disabled={!canSubmit}
          loading={isSubmitting}
          onClick={() =>
            onSubmit({ summary: summary.trim(), blockers: blockers.trim() || undefined })
          }
        >
          Submit Update
        </Button>
      </div>
    </div>
  );
}

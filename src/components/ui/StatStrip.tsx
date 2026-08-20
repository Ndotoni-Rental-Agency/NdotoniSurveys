import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { cn } from '@/lib/utils/common';

export interface StatItem {
  label: string;
  value: number;
  accent: string;
}

interface StatStripProps {
  items: StatItem[];
}

export function StatStrip({ items }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-800 border-y border-gray-100 dark:border-gray-800">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="animate-fade-up py-5 px-4 sm:px-6 first:pl-0"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className={cn('h-2 w-2 rounded-full', item.accent)} />
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
          </div>
          <AnimatedNumber
            value={item.value}
            className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums"
          />
        </div>
      ))}
    </div>
  );
}

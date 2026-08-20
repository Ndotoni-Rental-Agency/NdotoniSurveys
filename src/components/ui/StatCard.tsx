import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/common';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-brand-100 dark:bg-brand-900/20',
  className
}: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          {icon && (
            <div className={cn('p-2 rounded-lg flex-shrink-0', iconBgColor)}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

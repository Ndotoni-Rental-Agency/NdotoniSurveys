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
    <Card padding="none" className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4 space-y-3">
        {icon && (
          <div className={cn('h-9 w-9 rounded-lg flex items-center justify-center', iconBgColor)}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
            {value}
          </p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1.5 truncate">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

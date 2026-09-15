import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ className, variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-neutral-950 text-white',
    secondary: 'bg-neutral-100 text-neutral-700',
    success: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    destructive: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
  };
  return <span data-slot="badge" className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)} {...props} />;
};

export { Badge };

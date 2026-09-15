import React from 'react';
import { cn } from '../../lib/utils';

const Input = ({ className, type = 'text', ...props }) => (
  <input data-slot="input" type={type} className={cn('flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-shadow placeholder:text-neutral-400 focus-visible:border-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-100', className)} {...props} />
);

export { Input };

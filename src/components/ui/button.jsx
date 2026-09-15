import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 transform-gpu items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ease-out outline-none hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] active:shadow-sm focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:translate-y-0 disabled:scale-100 disabled:opacity-50 disabled:shadow-none motion-reduce:transform-none motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-900',
        outline: 'border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100',
        ghost: 'text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-950 active:bg-neutral-200',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

const Button = ({ className, variant, size, asChild = false, ...props }) => {
  const Component = asChild ? Slot : 'button';
  return <Component data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
};

export { Button };

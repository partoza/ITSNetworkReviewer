import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = ({ className, children, ...props }) => (
  <SelectPrimitive.Trigger data-slot="select-trigger" className={cn('flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-left text-sm outline-none transition-shadow focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate', className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild><ChevronDown className="size-4 text-neutral-400" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({ className, children, position = 'popper', ...props }) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content data-slot="select-content" position={position} className={cn('relative z-[60] max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-lg', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1', className)} {...props}>
      <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center"><ChevronUp className="size-4" /></SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]')}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center"><ChevronDown className="size-4" /></SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectItem = ({ className, children, ...props }) => (
  <SelectPrimitive.Item data-slot="select-item" className={cn('relative flex w-full cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50', className)} {...props}>
    <span className="absolute left-2 flex size-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="size-4" /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = ({ className, ...props }) => (
  <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn('fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=open]:animate-in', className)} {...props} />
);

const DialogContent = ({ className, children, showCloseButton = true, ...props }) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content data-slot="dialog-content" className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xl outline-none', className)} {...props}>
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-300">
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }) => <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />;
const DialogTitle = ({ className, ...props }) => <DialogPrimitive.Title data-slot="dialog-title" className={cn('text-lg font-medium tracking-tight', className)} {...props} />;
const DialogDescription = ({ className, ...props }) => <DialogPrimitive.Description data-slot="dialog-description" className={cn('text-sm leading-6 text-neutral-500', className)} {...props} />;
const DialogFooter = ({ className, ...props }) => <div data-slot="dialog-footer" className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };

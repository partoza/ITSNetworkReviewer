import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ className, ...props }) => <div data-slot="card" className={cn('rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow-sm', className)} {...props} />;
const CardHeader = ({ className, ...props }) => <div data-slot="card-header" className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />;
const CardTitle = ({ className, ...props }) => <h2 data-slot="card-title" className={cn('text-xl font-medium tracking-tight', className)} {...props} />;
const CardDescription = ({ className, ...props }) => <p data-slot="card-description" className={cn('text-sm text-neutral-500', className)} {...props} />;
const CardContent = ({ className, ...props }) => <div data-slot="card-content" className={cn('p-6 pt-0', className)} {...props} />;
const CardFooter = ({ className, ...props }) => <div data-slot="card-footer" className={cn('flex items-center p-6 pt-0', className)} {...props} />;

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

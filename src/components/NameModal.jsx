import React, { useState } from 'react';
import { ArrowRight, UserRound } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

const normalizeName = (value) => value.trim().replace(/\s+/g, ' ');

const validateName = (value) => {
  const name = normalizeName(value);
  if (name.length < 2) return 'Enter at least 2 characters.';
  if (name.length > 30) return 'Use 30 characters or fewer.';
  if (!/^[\p{L}\p{N}][\p{L}\p{N} ._'’-]*$/u.test(name)) return 'Use letters, numbers, spaces, apostrophes, periods, underscores, or hyphens only.';
  return '';
};

const NameModal = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationError = validateName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(normalizeName(name));
  };

  const handleChange = (event) => {
    setName(event.target.value);
    if (error) setError('');
  };

  return (
    <Dialog open>
      <DialogContent showCloseButton={false} onEscapeKeyDown={(event) => event.preventDefault()} onPointerDownOutside={(event) => event.preventDefault()} className="max-w-md">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="items-center text-center">
            <div className="mb-2 grid size-11 place-items-center rounded-xl bg-neutral-100 text-neutral-700">
              <UserRound className="size-5" strokeWidth={1.5} />
            </div>
            <DialogTitle>What should we call you?</DialogTitle>
            <DialogDescription>Your name appears on each subject leaderboard.</DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-2">
            <label htmlFor="player-name" className="text-sm font-medium text-neutral-700">Player name</label>
            <Input
              id="player-name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your name"
              minLength={2}
              maxLength={30}
              autoComplete="nickname"
              autoFocus
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'player-name-error' : undefined}
            />
            {error && <p id="player-name-error" className="text-sm text-red-600" role="alert">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">Continue <ArrowRight /></Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameModal;

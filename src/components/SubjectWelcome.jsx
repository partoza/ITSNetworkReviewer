import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ListChecks, Shuffle, Trophy } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const SubjectWelcome = ({ subject, onStart, onLeaderboard, onBack }) => (
  <Card className="w-full max-w-3xl overflow-hidden border-neutral-200 shadow-[0_16px_50px_rgba(0,0,0,0.06)]">
    <CardHeader className="items-center px-6 pb-2 pt-6 text-center sm:px-10 sm:pt-8">
      <Button variant="ghost" size="sm" className="mb-3 self-start" onClick={onBack}>
        <ArrowLeft /> All subjects
      </Button>
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-neutral-950 text-white">
        <BookOpen className="size-7" strokeWidth={1.5} />
      </div>
      <Badge variant="secondary" className="mb-2">Study module</Badge>
      <CardTitle className="text-2xl font-medium sm:text-3xl">{subject.name}</CardTitle>
      <CardDescription className="max-w-xl text-sm leading-6 sm:text-base">{subject.description}</CardDescription>
    </CardHeader>

    <CardContent className="px-6 py-6 sm:px-10">
      <div className="grid overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 sm:grid-cols-3">
        <div className="flex items-center gap-3 p-4">
          <ListChecks className="size-5 text-neutral-500" strokeWidth={1.5} />
          <div><p className="text-xs text-neutral-500">Questions</p><p className="text-sm font-medium text-neutral-900">{subject.questions.length}</p></div>
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-200 p-4 sm:border-l sm:border-t-0">
          <Trophy className="size-5 text-neutral-500" strokeWidth={1.5} />
          <div><p className="text-xs text-neutral-500">Scoring</p><p className="text-sm font-medium text-neutral-900">1 point each</p></div>
        </div>
        <div className="flex items-center gap-3 border-t border-neutral-200 p-4 sm:border-l sm:border-t-0">
          <Shuffle className="size-5 text-neutral-500" strokeWidth={1.5} />
          <div><p className="text-xs text-neutral-500">Question order</p><p className="text-sm font-medium text-neutral-900">Randomized</p></div>
        </div>
      </div>
    </CardContent>

    <CardFooter className="flex-col gap-3 px-6 pb-8 sm:flex-row sm:justify-center sm:px-10">
      <Button size="lg" className="w-full sm:w-auto" onClick={onStart}>Start answering <ArrowRight /></Button>
      <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={onLeaderboard}><Trophy /> View subject leaderboard</Button>
    </CardFooter>
  </Card>
);

export default SubjectWelcome;

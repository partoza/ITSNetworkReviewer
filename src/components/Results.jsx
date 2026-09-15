import React, { useState, useEffect } from 'react';
import Leaderboard from './Leaderboard';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const isQuestionCorrect = (question, userAnswer) => {
  if (question.type === 'match' || question.type === 'multi-part') {
    return Object.keys(question.correctAnswer).every(
      (definition) => userAnswer && userAnswer[definition] === question.correctAnswer[definition],
    );
  }
  if (question.type === 'multiple-select') {
    return Array.isArray(userAnswer)
      && userAnswer.length === question.correctAnswer.length
      && userAnswer.every((value) => question.correctAnswer.includes(value));
  }
  return userAnswer === question.correctAnswer;
};

const Results = ({ score, total, userAnswers, questions, onReturnHome, onRestart, userName, subject }) => {
  const [showReview, setShowReview] = useState(false);
  const [scoreStatus, setScoreStatus] = useState('saving');
  const [scoreMessage, setScoreMessage] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all');

  useEffect(() => {
    const controller = new AbortController();

    if (userName && subject) {
      setScoreStatus('saving');
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, score, subject: subject.id }),
        signal: controller.signal,
      })
        .then(async (response) => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'Score could not be saved.');
          setScoreStatus('saved');
          setScoreMessage(`Personal best: ${data.personalBest}/${total}`);
        })
        .catch((error) => {
          if (error.name === 'AbortError') return;
          console.error('Failed to post score', error);
          setScoreStatus('error');
          setScoreMessage(error.message);
        });
    }

    return () => controller.abort();
  }, [userName, score, subject, total]);

  const percentage = Math.round((score / total) * 100);
  const reviewItems = questions.map((question, index) => ({
    question,
    index,
    userAnswer: userAnswers[question.id],
    isCorrect: isQuestionCorrect(question, userAnswers[question.id]),
  }));
  const filteredReviewItems = reviewItems.filter(({ isCorrect }) => (
    reviewFilter === 'all' || (reviewFilter === 'correct' ? isCorrect : !isCorrect)
  ));

  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '100%' }}>
      {!showReview ? (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '0.5rem' }}>Questionnaire Complete!</h1>
          <p style={{ marginBottom: '3rem' }}>{subject?.name} Module</p>
          {scoreMessage && <p className={scoreStatus === 'error' ? 'text-sm text-red-600' : 'text-sm text-emerald-700'} role="status">{scoreMessage}</p>}

          <div style={{ 
            width: '200px', 
            height: '200px', 
            borderRadius: '50%', 
            background: `conic-gradient(var(--primary-color) ${percentage}%, var(--border-color) 0)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 3rem',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              background: 'var(--surface-color)',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{score}</span>
              <span style={{ color: 'var(--text-secondary)' }}>out of {total}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <Button variant="outline" onClick={() => setShowReview(true)}>
              View Results Review
            </Button>
            <Button variant="outline" onClick={onRestart}>
              Try Again
            </Button>
            <Button onClick={onReturnHome}>
              Return to Dashboard
            </Button>
          </div>

          <Leaderboard subject={subject} currentUserName={userName} refreshKey={scoreStatus} />
        </div>
      ) : (
        <div>
          <div className="review-header">
            <h2 className="mb-0">Detailed Review</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReview(false)} 
            >
              ← Back to Score
            </Button>
          </div>

          <div className="review-toolbar">
            <p className="text-sm text-neutral-500">
              Showing {filteredReviewItems.length} of {questions.length} questions
            </p>
            <Select value={reviewFilter} onValueChange={setReviewFilter}>
              <SelectTrigger className="w-full sm:w-44" aria-label="Filter review results">
                <SelectValue placeholder="Filter results" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All questions ({questions.length})</SelectItem>
                <SelectItem value="correct">Correct ({score})</SelectItem>
                <SelectItem value="incorrect">Incorrect ({total - score})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredReviewItems.map(({ question: q, index: idx, userAnswer, isCorrect }) => {
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className={`badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </div>
                  <h3 className="review-question">{idx + 1}. {q.question}</h3>
                  
                  {q.type === 'multiple-select' ? (
                    <div className="review-answer-panel">
                      <div className="review-answer-row user-answer">
                        <span className="review-answer-label">Your answers</span>
                        {(userAnswer || []).length > 0 ? (
                          (userAnswer || []).map((ans, aIdx) => (
                            <span key={aIdx} className={`review-answer ${q.correctAnswer.includes(ans) ? 'answer-correct' : 'answer-incorrect'}`}>{ans}</span>
                          ))
                        ) : (
                          <span className="review-answer answer-incorrect">No answer</span>
                        )}
                      </div>
                      {!isCorrect && (
                        <div className="review-answer-row correct-answer">
                          <span className="review-answer-label">Correct answers</span>
                          {q.correctAnswer.map((ans, aIdx) => (
                            <span key={aIdx} className="review-answer answer-correct">{ans}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : q.type === 'match' || q.type === 'multi-part' ? (
                    <div className="review-match-list">
                      {(q.definitions || q.parts.map(p => p.label)).map((def, dIdx) => {
                        const uAns = userAnswer?.[def];
                        const cAns = q.correctAnswer[def];
                        const matchCorrect = uAns === cAns;
                        return (
                          <div key={dIdx} className="review-match-item">
                            <p className="review-match-prompt">{def}</p>
                            <div className="review-answer-panel">
                              <div className="review-answer-row user-answer">
                                <span className="review-answer-label">Your match</span>
                                <span className={`review-answer ${matchCorrect ? 'answer-correct' : 'answer-incorrect'}`}>{uAns || 'No answer'}</span>
                              </div>
                              {!matchCorrect && (
                                <div className="review-answer-row correct-answer">
                                  <span className="review-answer-label">Correct match</span>
                                  <span className="review-answer answer-correct">{cAns}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="review-answer-panel">
                      <div className="review-answer-row user-answer">
                        <span className="review-answer-label">Your answer</span>
                        <span className={`review-answer ${isCorrect ? 'answer-correct' : 'answer-incorrect'}`}>{userAnswer || 'No answer'}</span>
                      </div>
                      {!isCorrect && (
                        <div className="review-answer-row correct-answer">
                          <span className="review-answer-label">Correct answer</span>
                          <span className="review-answer answer-correct">{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Button className="mt-8 w-full" onClick={onReturnHome}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default Results;

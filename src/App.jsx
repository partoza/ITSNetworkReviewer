import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Results from './components/Results';
import NameModal from './components/NameModal';
import Leaderboard from './components/Leaderboard';
import SubjectWelcome from './components/SubjectWelcome';
import { getSubject } from './data/subjects';
import { shuffleArray } from './utils';

const PLAYER_NAME_KEY = 'its-reviewer:player-name';

const readSavedPlayerName = () => {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || '';
  } catch {
    return '';
  }
};

function App() {
  const [authStatus, setAuthStatus] = useState('checking');
  const [userName, setUserName] = useState(readSavedPlayerName);
  const [currentView, setCurrentView] = useState('home'); // home, subject, quiz, results, leaderboard
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const selectedSubject = getSubject(selectedSubjectId);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/status', { cache: 'no-store', credentials: 'same-origin', signal: controller.signal })
      .then((response) => response.ok ? response.json() : { authenticated: false })
      .then((data) => setAuthStatus(data.authenticated ? 'authenticated' : 'unauthenticated'))
      .catch((error) => {
        if (error.name !== 'AbortError') setAuthStatus('unauthenticated');
      });
    return () => controller.abort();
  }, []);

  const handleLogin = async (passcode) => {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ passcode }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Authentication failed.');
    setAuthStatus('authenticated');
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setCurrentView('subject');
  };

  const handleStartQuiz = () => {
    if (!selectedSubject) return;
    setUserAnswers({});
    setScore(0);
    setShuffledQuestions(shuffleArray(selectedSubject.questions));
    setCurrentView('quiz');
  };

  const handleFinishQuiz = (finalAnswers) => {
    setUserAnswers(finalAnswers);
    
    // Calculate score
    let calculatedScore = 0;
    shuffledQuestions.forEach((q) => {
      const userAnswer = finalAnswers[q.id];
      if (q.type === 'match' || q.type === 'multi-part') {
        // For match and multi-part, check if all sub-answers match
        const isAllMatchCorrect = Object.keys(q.correctAnswer).every(
          def => userAnswer && userAnswer[def] === q.correctAnswer[def]
        );
        if (isAllMatchCorrect) {
          calculatedScore += 1;
        }
      } else if (q.type === 'multiple-select') {
        const isAllCorrect = Array.isArray(userAnswer) && 
                             userAnswer.length === q.correctAnswer.length &&
                             userAnswer.every(val => q.correctAnswer.includes(val));
        if (isAllCorrect) {
          calculatedScore += 1;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          calculatedScore += 1;
        }
      }
    });
    setScore(calculatedScore);
    setCurrentView('results');
  };

  const handleReturnHome = () => {
    setUserAnswers({});
    setScore(0);
    setCurrentView('home');
  };

  const handleNameSubmit = (name) => {
    setUserName(name);
    try {
      localStorage.setItem(PLAYER_NAME_KEY, name);
    } catch {
      // The quiz can still run when browser storage is unavailable.
    }
  };

  return (
    <div className="app-container">
      {authStatus === 'checking' && (
        <div className="glass-card w-full max-w-md text-center" role="status">
          <p>Checking secure access…</p>
        </div>
      )}

      {authStatus === 'unauthenticated' && (
        <Login onLogin={handleLogin} />
      )}

      {authStatus === 'authenticated' && !userName && (
        <NameModal onSubmit={handleNameSubmit} />
      )}

      {authStatus === 'authenticated' && userName && currentView === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
          <Dashboard onSelectSubject={handleSelectSubject} userName={userName} />
        </div>
      )}

      {authStatus === 'authenticated' && userName && selectedSubject && currentView === 'subject' && (
        <SubjectWelcome
          subject={selectedSubject}
          onStart={handleStartQuiz}
          onLeaderboard={() => setCurrentView('leaderboard')}
          onBack={() => setCurrentView('home')}
        />
      )}

      {authStatus === 'authenticated' && userName && selectedSubject && currentView === 'leaderboard' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Leaderboard subject={selectedSubject} currentUserName={userName} onBack={() => setCurrentView('subject')} />
        </div>
      )}

      {authStatus === 'authenticated' && userName && currentView === 'quiz' && (
        <Quiz questions={shuffledQuestions} onFinish={handleFinishQuiz} subject={selectedSubject} />
      )}

      {authStatus === 'authenticated' && userName && currentView === 'results' && (
        <Results 
          score={score} 
          total={shuffledQuestions.length} 
          userAnswers={userAnswers} 
          questions={shuffledQuestions}
          onReturnHome={handleReturnHome}
          onRestart={handleStartQuiz}
          userName={userName}
          subject={selectedSubject}
        />
      )}
    </div>
  );
}

export default App;

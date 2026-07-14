import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Results from './components/Results';
import NameModal from './components/NameModal';
import Leaderboard from './components/Leaderboard';
import { questions } from './data/questions';
import { shuffleArray } from './utils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentView, setCurrentView] = useState('login'); // login, home, quiz, results, leaderboard
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  const handleLogin = (password) => {
    if (password === '445909') {
      setIsAuthenticated(true);
      setCurrentView('home');
    } else {
      return false;
    }
    return true;
  };

  const handleStartQuiz = () => {
    setUserAnswers({});
    setScore(0);
    setShuffledQuestions(shuffleArray(questions));
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
  };

  return (
    <div className="app-container">
      {!isAuthenticated && (
        <Login onLogin={handleLogin} />
      )}

      {isAuthenticated && !userName && (
        <NameModal onSubmit={handleNameSubmit} />
      )}

      {isAuthenticated && userName && currentView === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
          <Dashboard onStartQuiz={handleStartQuiz} userName={userName} />
          <div style={{ textAlign: 'center' }}>
            <button className="btn" style={{ width: 'auto', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setCurrentView('leaderboard')}>
              View Leaderboard
            </button>
          </div>
        </div>
      )}

      {isAuthenticated && userName && currentView === 'leaderboard' && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Leaderboard currentUserName={userName} onBack={() => setCurrentView('home')} />
        </div>
      )}

      {isAuthenticated && userName && currentView === 'quiz' && (
        <Quiz questions={shuffledQuestions} onFinish={handleFinishQuiz} />
      )}

      {isAuthenticated && userName && currentView === 'results' && (
        <Results 
          score={score} 
          total={shuffledQuestions.length} 
          userAnswers={userAnswers} 
          questions={shuffledQuestions}
          onReturnHome={handleReturnHome}
          onRestart={handleStartQuiz}
          userName={userName}
        />
      )}
    </div>
  );
}

export default App;

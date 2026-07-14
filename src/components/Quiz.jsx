import React, { useState, useEffect, useMemo } from 'react';
import question3Image from '../assets/question.jpg';
import { shuffleArray } from '../utils';

const imageMap = {
  '3': question3Image
};

const Quiz = ({ questions, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const shuffledOptions = useMemo(() => {
    if (!currentQuestion) return null;
    if (currentQuestion.options) {
      return shuffleArray(currentQuestion.options);
    }
    return null;
  }, [currentQuestion]);

  const shuffledTerms = useMemo(() => {
    if (!currentQuestion) return null;
    if (currentQuestion.type === 'match' && currentQuestion.terms) {
      return shuffleArray(currentQuestion.terms);
    }
    return null;
  }, [currentQuestion]);

  // Reset answer when question changes
  useEffect(() => {
    setCurrentAnswer(null);
  }, [currentIndex]);

  const handleNext = () => {
    const newAnswers = { ...userAnswers, [currentQuestion.id]: currentAnswer };
    setUserAnswers(newAnswers);

    if (isLastQuestion) {
      onFinish(newAnswers);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMatchSelect = (def, term) => {
    setCurrentAnswer(prev => ({
      ...(prev || {}),
      [def]: term
    }));
  };

  const handleMultipleSelect = (option) => {
    setCurrentAnswer(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(option)) {
        return arr.filter(item => item !== option);
      } else {
        if (currentQuestion.requiredCount && arr.length >= currentQuestion.requiredCount) {
          return arr; // max selected
        }
        return [...arr, option];
      }
    });
  };

  const progressPercentage = ((currentIndex) / questions.length) * 100;

  let isAnswerComplete = false;
  if (currentQuestion.type === 'match') {
    if (currentAnswer && Object.keys(currentAnswer).length === currentQuestion.definitions.length) {
      isAnswerComplete = Object.values(currentAnswer).every(val => val !== '');
    }
  } else if (currentQuestion.type === 'multi-part') {
    if (currentAnswer && Object.keys(currentAnswer).length === currentQuestion.parts.length) {
      isAnswerComplete = Object.values(currentAnswer).every(val => val !== '');
    }
  } else if (currentQuestion.type === 'multiple-select') {
    isAnswerComplete = Array.isArray(currentAnswer) && currentAnswer.length === currentQuestion.requiredCount;
  } else {
    isAnswerComplete = !!currentAnswer;
  }

  return (
    <div className="glass-card" style={{ maxWidth: '800px', width: '100%' }}>
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Network Security</span>
      </div>

      <h2 className="question-text" style={{ marginBottom: '1.5rem', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>{currentQuestion.question}</h2>

      {currentQuestion.imagePlaceholder && imageMap[currentQuestion.id] ? (
        <img 
          src={imageMap[currentQuestion.id]} 
          alt="Question context" 
          style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }} 
        />
      ) : currentQuestion.imagePlaceholder && (
        <div style={{
          width: '100%',
          height: '200px',
          background: '#f5f5f5',
          border: '1px dashed var(--text-secondary)',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          color: 'var(--text-secondary)'
        }}>
          [ Image: application.bat Properties / Security Tab ]
        </div>
      )}

      {currentQuestion.type === 'match' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {currentQuestion.definitions.map((def, dIdx) => (
            <div key={dIdx} style={{ background: 'transparent', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <p style={{ marginBottom: '1rem', color: '#1f2937', fontWeight: '400' }}>{def}</p>
              <select
                className="input-field"
                value={currentAnswer?.[def] || ''}
                onChange={(e) => handleMatchSelect(def, e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: '#ffffff',
                  color: '#1f2937',
                  border: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer'
                }}
              ><option value="" disabled>Select the matching policy...</option>
                {shuffledTerms.map((term, tIdx) => (
                  <option key={tIdx} value={term}>{term}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      ) : currentQuestion.type === 'multi-part' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {currentQuestion.parts.map((part, pIdx) => (
            <div key={pIdx} style={{ background: 'transparent', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <p style={{ marginBottom: '1rem', color: '#1f2937', fontWeight: '400' }}>{part.label}</p>
              <div className="multi-part-options" style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
                {part.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer?.[part.label] === opt;
                  return (
                    <button
                      key={oIdx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleMatchSelect(part.label, opt)}
                      style={{ 
                        background: '#ffffff',
                        border: isSelected ? '2px solid var(--primary-color)' : '2px solid transparent',
                        padding: '0.75rem 1rem', 
                        flex: '1', 
                        borderRadius: '8px',
                        justifyContent: 'center',
                        color: '#1f2937',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    >
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '50%', 
                        border: '2px solid',
                        borderColor: isSelected ? 'var(--primary-color)' : '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem',
                        flexShrink: 0
                      }}>
                        {isSelected && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                        )}
                      </div>
                      <span style={{ fontSize: '1rem' }}>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : currentQuestion.type === 'multiple-select' ? (
        <div className="options-grid">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select exactly {currentQuestion.requiredCount} options.</p>
          {shuffledOptions.map((opt, idx) => {
            const isSelected = Array.isArray(currentAnswer) && currentAnswer.includes(opt);
            return (
              <button
                key={idx}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleMultipleSelect(opt)}
              >
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '0.25rem', 
                  border: '2px solid',
                  borderColor: isSelected ? 'var(--primary-color)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  background: isSelected ? 'var(--primary-color)' : 'transparent'
                }}>
                  {isSelected && (
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                  )}
                </div>
                <span style={{ textAlign: 'left' }}>{opt}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="options-grid">
          {shuffledOptions.map((opt, idx) => (
            <button
              key={idx}
              className={`option-btn ${currentAnswer === opt ? 'selected' : ''}`}
              onClick={() => setCurrentAnswer(opt)}
            >
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                border: '2px solid',
                borderColor: currentAnswer === opt ? 'var(--primary-color)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {currentAnswer === opt && (
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }}></div>
                )}
              </div>
              <span style={{ textAlign: 'left' }}>{opt}</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button 
          className="btn" 
          style={{ width: 'auto' }} 
          onClick={handleNext}
          disabled={!isAnswerComplete}
        >
          {isLastQuestion ? 'Submit Questionnaire' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;

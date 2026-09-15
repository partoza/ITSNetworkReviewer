import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { subjects } from '../data/subjects';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const CACHE_KEY_PREFIX = 'its-reviewer:complete-data-cache:v1';
const LEGACY_CACHE_KEY = 'its-reviewer:leaderboard-cache:v1';
const reviewerContent = {
  subjects,
};
const contentFingerprint = JSON.stringify(reviewerContent);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const RankMedal = ({ rank }) => {
  let color = 'var(--text-secondary)';
  if (rank === 1) color = '#F59E0B';
  if (rank === 2) color = '#9CA3AF';
  if (rank === 3) color = '#D97706';

  if (rank > 3) return <div className="leaderboard-rank">{rank}</div>;

  return (
    <div className="leaderboard-medal">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={`Rank ${rank}`}>
        <circle cx="12" cy="8" r="7"></circle>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
      </svg>
    </div>
  );
};

const normalizeScores = (scores) => {
  if (!Array.isArray(scores)) return [];

  return scores
    .filter((entry) => entry && typeof entry.name === 'string' && Number.isFinite(Number(entry.score)))
    .map((entry) => ({
      name: entry.name,
      score: Number(entry.score),
      date: entry.date || new Date(0).toISOString(),
    }))
    .sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date));
};

const fingerprintScores = (scores) => JSON.stringify(
  scores.map(({ name, score, date }) => [name, score, date]),
);

const readSavedReviewer = (cacheKey) => {
  try {
    const saved = JSON.parse(localStorage.getItem(cacheKey));
    if (saved?.content?.subjects && Array.isArray(saved?.leaderboard?.scores)) {
      const scores = normalizeScores(saved.leaderboard.scores);
      return {
        ...saved,
        leaderboard: {
          scores,
          fingerprint: saved.leaderboard.fingerprint || fingerprintScores(scores),
        },
      };
    }

    const legacy = JSON.parse(localStorage.getItem(LEGACY_CACHE_KEY));
    if (!legacy || !Array.isArray(legacy.scores)) return null;

    const scores = normalizeScores(legacy.scores);
    return {
      content: null,
      contentFingerprint: null,
      leaderboard: { scores, fingerprint: legacy.fingerprint || fingerprintScores(scores) },
      savedAt: legacy.savedAt,
    };
  } catch {
    return null;
  }
};

const Leaderboard = ({ subject, currentUserName, onBack, refreshKey }) => {
  const cacheKey = `${CACHE_KEY_PREFIX}:${subject?.id || 'all'}`;
  const [savedCopy, setSavedCopy] = useState(() => readSavedReviewer(cacheKey));
  const [scores, setScores] = useState(() => readSavedReviewer(cacheKey)?.leaderboard?.scores || []);
  const [networkScores, setNetworkScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState('connecting');
  const [message, setMessage] = useState('');

  const fetchScores = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);

    try {
      const query = new URLSearchParams({ subject: subject?.id || '' });
      const response = await fetch(`/api/leaderboard?${query}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Leaderboard request failed (${response.status})`);

      const data = await response.json();
      const latestScores = normalizeScores(data.scores);
      setScores(latestScores);
      setNetworkScores(latestScores);
      setConnectionState('online');
      setMessage('');
    } catch (error) {
      console.error('Failed to load leaderboard', error);
      setConnectionState('offline');
      setMessage(savedCopy ? 'Network unavailable — showing leaderboard data saved in this browser.' : 'Could not reach the shared leaderboard. Check that you are on the same network.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [savedCopy, subject]);

  useEffect(() => {
    fetchScores();
    const refreshTimer = window.setInterval(() => fetchScores({ silent: true }), 15000);
    return () => window.clearInterval(refreshTimer);
  }, [fetchScores, refreshKey]);

  useEffect(() => {
    const syncSavedCopy = (event) => {
      if (event.key !== cacheKey) return;
      const saved = readSavedReviewer(cacheKey);
      setSavedCopy(saved);
      if (connectionState === 'offline' && saved) setScores(saved.leaderboard.scores);
    };

    window.addEventListener('storage', syncSavedCopy);
    return () => window.removeEventListener('storage', syncSavedCopy);
  }, [cacheKey, connectionState]);

  const networkFingerprint = useMemo(
    () => networkScores ? fingerprintScores(networkScores) : null,
    [networkScores],
  );
  const contentIsSaved = savedCopy?.contentFingerprint === contentFingerprint;
  const leaderboardIsSaved = !networkFingerprint || savedCopy?.leaderboard?.fingerprint === networkFingerprint;
  const hasNewUpdate = Boolean(savedCopy && (!contentIsSaved || !leaderboardIsSaved));
  const isSaved = Boolean(savedCopy && contentIsSaved && leaderboardIsSaved);

  const saveToBrowser = () => {
    const nextSavedCopy = {
      content: reviewerContent,
      contentFingerprint,
      leaderboard: {
        scores: networkScores || scores,
        fingerprint: fingerprintScores(networkScores || scores),
      },
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(cacheKey, JSON.stringify(nextSavedCopy));
      localStorage.removeItem(LEGACY_CACHE_KEY);
      setSavedCopy(nextSavedCopy);
      const questionCount = subjects.reduce((total, item) => total + item.questions.length, 0);
      setMessage(`All ${subjects.length} subjects, ${questionCount} questions, answers, and the latest leaderboard are saved in this browser.`);
    } catch {
      setMessage('This browser could not save the leaderboard. Check its storage settings.');
    }
  };

  const cacheButtonLabel = hasNewUpdate
    ? 'Update cached data'
    : isSaved
      ? 'All data cached'
      : 'Save all data';

  return (
    <section className="glass-card leaderboard-card" aria-labelledby="leaderboard-title">
      <div className="leaderboard-header">
        <div>
          <h2 id="leaderboard-title" className="leaderboard-title">
            <TrophyIcon /> {subject?.name || 'Subject'} leaderboard
          </h2>
          <p className="leaderboard-subtitle">Only scores completed in this subject are ranked here.</p>
        </div>
        {onBack && <Button onClick={onBack} variant="ghost" size="sm">← Back</Button>}
      </div>

      <div className="leaderboard-toolbar">
        <Badge variant={connectionState === 'online' ? 'success' : connectionState === 'offline' ? 'destructive' : 'secondary'} className={`network-status ${connectionState}`} role="status">
          <span className="network-dot" aria-hidden="true"></span>
          {connectionState === 'online' ? 'Live on network' : connectionState === 'offline' ? 'Offline copy' : 'Connecting'}
        </Badge>
        <div className="leaderboard-actions">
          <Button variant="outline" size="sm" onClick={() => fetchScores()} disabled={loading}>
            {loading ? 'Checking…' : 'Refresh'}
          </Button>
          <Button variant={hasNewUpdate ? 'success' : 'default'} size="sm" onClick={saveToBrowser} disabled={isSaved}>
            {cacheButtonLabel}
          </Button>
        </div>
      </div>

      {hasNewUpdate && (
        <div className="leaderboard-update-notice" role="status">
          New reviewer content or leaderboard data is available. Update the browser cache to save the latest version.
        </div>
      )}

      {message && <p className="leaderboard-message" role="status">{message}</p>}

      {savedCopy?.savedAt && (
        <p className="leaderboard-saved-time">
          Complete reviewer data cached {new Date(savedCopy.savedAt).toLocaleString()}.
        </p>
      )}

      {loading && scores.length === 0 ? (
        <p className="leaderboard-empty">Loading scores…</p>
      ) : scores.length === 0 ? (
        <p className="leaderboard-empty">No scores yet. Be the first!</p>
      ) : (
        <div className="leaderboard-list">
          {scores.map((entry, idx) => {
            const isCurrentUser = entry.name.toLowerCase() === (currentUserName || '').toLowerCase();

            return (
              <div key={`${entry.name}-${entry.date}`} className={`leaderboard-entry${isCurrentUser ? ' current-user' : ''}`}>
                <div className="leaderboard-person">
                  <RankMedal rank={idx + 1} />
                  <div>
                    <strong className="leaderboard-name">
                      {entry.name} {isCurrentUser && <span className="leaderboard-you">(You)</span>}
                    </strong>
                    <span className="leaderboard-date">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="leaderboard-score" aria-label={`${entry.score} out of ${subject?.questions.length}`}>{entry.score}<span className="text-sm font-normal text-neutral-400">/{subject?.questions.length}</span></div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Leaderboard;

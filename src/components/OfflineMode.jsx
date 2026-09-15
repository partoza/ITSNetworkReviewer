import React, { useState } from 'react';
import { CheckCircle2, Download, Smartphone, Trash2 } from 'lucide-react';
import shieldImage from '../assets/image.png';
import cybersecImage from '../assets/cybersec.png';
import questionImage from '../assets/question.jpg';
import { subjects } from '../data/subjects';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const OFFLINE_VERSION_KEY = 'its-reviewer:offline-version';
const OFFLINE_DATA_KEY = 'its-reviewer:offline-content';
const APP_STORAGE_PREFIX = 'its-reviewer:';
const APP_CACHE_PREFIX = 'its-reviewer-';

const collectAppResources = () => {
  const loadedResources = performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((url) => url.startsWith(window.location.origin))
    .filter((url) => !new URL(url).pathname.startsWith('/api/'));

  return [...new Set([
    `${window.location.origin}/`,
    `${window.location.origin}/favicon.svg`,
    shieldImage,
    cybersecImage,
    questionImage,
    ...loadedResources,
  ])];
};

const OfflineMode = () => {
  const [savedVersion, setSavedVersion] = useState(() => localStorage.getItem(OFFLINE_VERSION_KEY));
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const currentVersion = __APP_VERSION__;
  const isSaved = savedVersion === currentVersion;
  const needsUpdate = Boolean(savedVersion && !isSaved);

  const saveForOffline = async () => {
    if (!('serviceWorker' in navigator)) {
      setMessage('Offline mode is not supported by this browser.');
      return;
    }

    setStatus('saving');
    setMessage('');

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      const worker = registration.active || registration.waiting || registration.installing;
      if (!worker) throw new Error('Offline worker is not ready.');

      const result = await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timeout = window.setTimeout(() => reject(new Error('Caching timed out.')), 20000);
        channel.port1.onmessage = (event) => {
          window.clearTimeout(timeout);
          resolve(event.data);
        };
        worker.postMessage({ type: 'CACHE_APP', resources: collectAppResources() }, [channel.port2]);
      });

      if (!result?.success || result.saved !== result.total) throw new Error('Some app files could not be cached.');

      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify({
        version: currentVersion,
        savedAt: new Date().toISOString(),
        subjects,
      }));
      localStorage.setItem(OFFLINE_VERSION_KEY, currentVersion);
      setSavedVersion(currentVersion);
      setStatus('saved');
      const questionCount = subjects.reduce((total, subject) => total + subject.questions.length, 0);
      setMessage(`Offline mode is ready. ${result.saved} app files and ${questionCount} questions were saved.`);
    } catch (error) {
      console.error('Could not enable offline mode', error);
      setStatus('error');
      setMessage('Could not save offline mode. Check your connection and try again.');
    }
  };

  const clearBrowserCache = async () => {
    setStatus('clearing');
    setMessage('');

    try {
      const clearAppStorage = (storage) => {
        const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
          .filter((key) => key?.startsWith(APP_STORAGE_PREFIX));
        keys.forEach((key) => storage.removeItem(key));
      };

      clearAppStorage(localStorage);
      clearAppStorage(sessionStorage);

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((cacheName) => cacheName.startsWith(APP_CACHE_PREFIX))
            .map((cacheName) => caches.delete(cacheName)),
        );
      }

      setSavedVersion(null);
      setStatus('cleared');
      setClearDialogOpen(false);
      setMessage('All ITS Reviewer data cached in this browser has been deleted. Shared leaderboard scores were not changed.');
    } catch (error) {
      console.error('Could not clear browser cache', error);
      setStatus('error');
      setMessage('Some cached data could not be deleted. Check this browser’s site-data settings and try again.');
    }
  };

  const buttonLabel = status === 'saving'
    ? 'Saving…'
    : needsUpdate
      ? 'Update offline version'
      : isSaved
        ? 'Available offline'
        : 'Save for Offline Mode';

  return (
    <Card className="shadow-none">
      <CardContent className="flex h-full flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-stretch">
        <div className="flex items-center gap-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${isSaved ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-700'}`}>
            {isSaved ? <CheckCircle2 className="size-5" strokeWidth={1.5} /> : <Download className="size-5" strokeWidth={1.5} />}
          </span>
          <div>
            <p className="text-sm font-medium text-neutral-900">Keep studying anywhere</p>
            <p className="mt-1 text-sm text-neutral-500">Cache every question, answer, and image.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
          <Button variant={needsUpdate ? 'success' : 'outline'} onClick={saveForOffline} disabled={status === 'saving' || isSaved}>
            <Download /> {buttonLabel}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><Smartphone /> Add to Home Screen</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto">
              <DialogHeader className="items-center text-center">
                <img src="/logo.png" alt="ITS Reviewer logo" className="mb-2 size-20 rounded-2xl object-cover shadow-sm" />
                <DialogTitle>Add ITS Reviewer to your Home Screen</DialogTitle>
                <DialogDescription>Launch the reviewer like an app and reach it quickly from your phone.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 sm:grid-cols-2">
                <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <h3 className="font-medium text-neutral-900">Android · Chrome</h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-600">
                    <li>Open ITS Reviewer in Chrome.</li>
                    <li>Tap the three-dot menu in the top-right corner.</li>
                    <li>Tap <strong className="text-neutral-900">Install app</strong> or <strong className="text-neutral-900">Add to Home screen</strong>.</li>
                    <li>Tap <strong className="text-neutral-900">Install</strong> or <strong className="text-neutral-900">Add</strong> to confirm.</li>
                  </ol>
                </section>

                <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <h3 className="font-medium text-neutral-900">iPhone or iPad · Safari</h3>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-neutral-600">
                    <li>Open ITS Reviewer in Safari.</li>
                    <li>Tap the <strong className="text-neutral-900">Share</strong> button.</li>
                    <li>Scroll down and tap <strong className="text-neutral-900">Add to Home Screen</strong>.</li>
                    <li>Review the name, then tap <strong className="text-neutral-900">Add</strong>.</li>
                  </ol>
                </section>
              </div>

              <p className="text-sm leading-6 text-neutral-500">Tip: save the reviewer for offline mode before leaving your network if you want questions available without an internet connection.</p>
              <DialogFooter>
                <DialogClose asChild><Button>Done</Button></DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50">
                <Trash2 /> Delete browser cache
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete cached reviewer data?</DialogTitle>
                <DialogDescription>This removes offline questions, answers, images, and cached leaderboard copies from this browser. Shared leaderboard scores are not deleted.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                <Button className="bg-red-600 hover:bg-red-700" onClick={clearBrowserCache} disabled={status === 'clearing'}>
                  <Trash2 /> {status === 'clearing' ? 'Deleting…' : 'Delete all cached data'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {message && <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-emerald-700'} sm:basis-full`} role="status">{message}</p>}
      </CardContent>
    </Card>
  );
};

export default OfflineMode;

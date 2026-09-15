import React, { useEffect, useState } from 'react';
import { ArrowRight, Send, UserPlus } from 'lucide-react';
import shieldImage from '../assets/image.png';
import cybersecImage from '../assets/cybersec.png';
import { subjects } from '../data/subjects';
import OfflineMode from './OfflineMode';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const subjectImages = {
  'network-security': shieldImage,
  cybersecurity: cybersecImage,
};

const isValidInviteUrl = (value) => {
  try {
    const url = new URL(value);
    const port = Number(url.port || (url.protocol === 'https:' ? 443 : 80));
    return ['http:', 'https:'].includes(url.protocol) && port >= 1 && port <= 65535;
  } catch {
    return false;
  }
};

const InvitePlayer = ({ userName }) => {
  const [networkUrls, setNetworkUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/network-info', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Network information is unavailable.');
        return response.json();
      })
      .then((data) => {
        const urls = (Array.isArray(data.urls) ? data.urls : [])
          .filter((item) => item && isValidInviteUrl(item.url))
          .filter((item, index, all) => all.findIndex((candidate) => candidate.url === item.url) === index);
        setNetworkUrls(urls);

        const currentIsPublic = !['localhost', '127.0.0.1'].includes(window.location.hostname);
        const preferred = urls.find((item) => /wi-?fi/i.test(item.networkName)) || urls[0];
        setSelectedUrl(currentIsPublic ? window.location.origin : (preferred?.url || window.location.origin));
      })
      .catch(() => setSelectedUrl(window.location.origin));
  }, []);

  const copyInvite = (text) => {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);

    const input = document.createElement('textarea');
    input.value = text;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    return Promise.resolve();
  };

  const sendInvite = async () => {
    const url = isValidInviteUrl(selectedUrl) ? selectedUrl : window.location.origin;
    const inviteText = `${userName} invited you to play ITS Reviewer. Open ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'ITS Reviewer invitation', text: inviteText, url });
        setMessage('Invitation opened in your share app.');
      } else {
        await copyInvite(inviteText);
        setMessage('Invitation copied. Send it to your friend.');
      }
      setIsOpen(false);
    } catch (error) {
      if (error?.name !== 'AbortError') {
        await copyInvite(inviteText);
        setMessage('Invitation copied. Send it to your friend.');
        setIsOpen(false);
      }
    }
  };

  return (
    <Card className="shadow-none">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-900">Play with a friend</p>
          <p className="mt-1 text-sm text-neutral-500">Share the deployed link or a local network address.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><UserPlus /> Invite player</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a player</DialogTitle>
              <DialogDescription>On Vercel, share the public URL. For a local server, choose the Wi-Fi address with its port.</DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <label className="text-sm font-medium text-neutral-700">Invite address</label>
              {networkUrls.length > 0 ? (
                <Select value={selectedUrl} onValueChange={setSelectedUrl}>
                  <SelectTrigger><SelectValue placeholder="Choose a network address" /></SelectTrigger>
                  <SelectContent>
                    {networkUrls.map((item) => (
                      <SelectItem key={`${item.networkName}-${item.address}`} value={item.url}>{item.url} · {item.networkName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 break-all">{selectedUrl || window.location.origin}</div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={sendInvite} disabled={!isValidInviteUrl(selectedUrl || window.location.origin)}><Send /> Send invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {message && <p className="text-sm text-emerald-700 sm:basis-full" role="status">{message}</p>}
      </CardContent>
    </Card>
  );
};

const Dashboard = ({ onSelectSubject, userName }) => (
  <div className="w-full space-y-6">
    <Card className="border-neutral-200 bg-neutral-50/70 shadow-[0_16px_50px_rgba(0,0,0,0.05)]">
      <CardHeader className="items-center pb-4 text-center">
        <p className="text-sm text-neutral-500">Welcome, {userName}</p>
        <CardTitle className="text-2xl font-medium sm:text-3xl">Choose a subject</CardTitle>
        <CardDescription className="max-w-xl">Open a module to see its details, start answering, or view its separate leaderboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <Button key={subject.id} variant="outline" className="group h-auto w-full flex-col items-stretch overflow-hidden p-0 text-left whitespace-normal" onClick={() => onSelectSubject(subject.id)}>
              <img src={subjectImages[subject.id]} alt="" className="aspect-[16/9] w-full object-cover" />
              <span className="flex items-center justify-between gap-4 p-5">
                <span>
                  <span className="block text-base font-medium text-neutral-900">{subject.name}</span>
                  <span className="mt-1 block text-sm font-normal text-neutral-500">{subject.questions.length} questions</span>
                </span>
                <ArrowRight className="size-5 text-neutral-400 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </span>
            </Button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InvitePlayer userName={userName} />
          <OfflineMode />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Dashboard;

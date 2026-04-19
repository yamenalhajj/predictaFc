import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, X } from 'lucide-react';
import type { Tier } from '../lib/supabase';

interface Props {
  tier: Tier;
  filesUsed: number;
  filesLimit: number;
  fileSizeLimitMB: number;
  userId: string;
  onUploadComplete?: () => void;
}

type Status = 'idle' | 'dragging' | 'validating' | 'uploading' | 'success' | 'error';

const REQUIRED_COLS = ['date', 'home_team', 'away_team', 'home_score', 'away_score'];

export default function FileUpload({ tier, filesUsed, filesLimit, fileSizeLimitMB, userId, onUploadComplete }: Props) {
  const [status,   setStatus]  = useState<Status>('idle');
  const [file,     setFile]    = useState<File | null>(null);
  const [message,  setMessage] = useState('');
  const [rowCount, setRowCount] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const canUpload = filesUsed < filesLimit;

  function validateCSVHeader(text: string): string | null {
    const firstLine = text.split('\n')[0].toLowerCase().trim();
    const cols = firstLine.split(',').map(c => c.trim().replace(/"/g, ''));
    const missing = REQUIRED_COLS.filter(r => !cols.includes(r));
    if (missing.length) return `Missing columns: ${missing.join(', ')}`;
    return null;
  }

  function countRows(text: string): number {
    return text.split('\n').filter(l => l.trim()).length - 1;
  }

  async function processFile(f: File) {
    setFile(f);
    setStatus('validating');
    setMessage('');

    if (f.size > fileSizeLimitMB * 1024 * 1024) {
      setStatus('error');
      setMessage(`File too large. Max size for ${tier === 'pro' ? 'Analyst' : 'Scout'} is ${fileSizeLimitMB} MB.`);
      return;
    }
    if (!f.name.endsWith('.csv')) {
      setStatus('error');
      setMessage('Only CSV files are accepted.');
      return;
    }

    const text = await f.text();
    const err = validateCSVHeader(text);
    if (err) { setStatus('error'); setMessage(err); return; }

    const rows = countRows(text);
    setRowCount(rows);
    setStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', f);
      formData.append('user_id', userId);

      const BASE = import.meta.env.DEV ? 'http://localhost:8000' : '/api';
      const res = await fetch(`${BASE}/upload_data`, { method: 'POST', body: formData });
      const json = await res.json();

      if (!res.ok) { setStatus('error'); setMessage(json.error ?? 'Upload failed.'); return; }

      setStatus('success');
      setMessage(`${rows.toLocaleString()} matches loaded. AI predictions will now use your data.`);
      onUploadComplete?.();
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setStatus('idle');
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }

  function reset() {
    setStatus('idle'); setFile(null); setMessage(''); setRowCount(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  if (!canUpload) {
    return (
      <div className="glass-card p-6 border-white/10 text-center">
        <Upload className="w-8 h-8 text-slate-700 mx-auto mb-2" />
        <p className="text-sm text-slate-500 font-body">
          You've used all {filesLimit} file slot{filesLimit !== 1 ? 's' : ''} for your plan.
        </p>
        <p className="text-xs text-slate-600 font-body mt-1">
          {tier === 'pro' ? 'Upgrade to Scout for 5 upload slots.' : 'Contact support to reset your slots.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={e => { e.preventDefault(); setStatus('dragging'); }}
        onDragLeave={() => status === 'dragging' && setStatus('idle')}
        onDrop={onDrop}
        onClick={() => status === 'idle' && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer
          ${status === 'dragging' ? 'border-gold/60 bg-gold/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
          ${(status === 'success' || status === 'error') ? 'cursor-default' : ''}`}
      >
        <input ref={inputRef} type="file" accept=".csv" onChange={onChange} className="hidden" />

        {status === 'idle' || status === 'dragging' ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-gold" />
            </div>
            <p className="font-heading text-sm font-bold text-white mb-1">
              {status === 'dragging' ? 'Drop it here' : 'Drop your CSV or click to browse'}
            </p>
            <p className="text-xs text-slate-500 font-body">
              Required: date, home_team, away_team, home_score, away_score · Max {fileSizeLimitMB} MB
            </p>
          </>
        ) : status === 'validating' || status === 'uploading' ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-sm font-body text-slate-400">
              {status === 'validating' ? 'Validating file…' : `Uploading ${file?.name}…`}
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <div>
              <p className="font-heading text-sm font-bold text-white mb-1">Upload successful</p>
              <p className="text-xs text-slate-400 font-body">{message}</p>
            </div>
            <button onClick={reset} className="text-xs text-gold hover:text-gold-light transition-colors font-body cursor-pointer">
              Upload another file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <div>
              <p className="font-heading text-sm font-bold text-white mb-1">Upload failed</p>
              <p className="text-xs text-red-400 font-body">{message}</p>
            </div>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-white transition-colors font-body cursor-pointer flex items-center gap-1">
              <X className="w-3 h-3" /> Try again
            </button>
          </div>
        )}
      </div>

      {/* Uploaded file display */}
      {file && (status === 'uploading' || status === 'success') && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-heading font-semibold text-slate-300 truncate">{file.name}</p>
            <p className="text-[10px] text-slate-600 font-body">
              {(file.size / 1024).toFixed(1)} KB
              {rowCount !== null && ` · ${rowCount.toLocaleString()} matches`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

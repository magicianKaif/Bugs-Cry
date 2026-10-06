import { useCallback, useRef, useState } from 'react';
import { fileToEvidence, isBlocked } from '@/lib/files';
import type { EvidenceItem, StageInfo } from '@/types';

interface AnalyzerProps {
  stages: StageInfo[];
  log: string[];
  running: boolean;
  error: string | null;
  onRun: (evidence: EvidenceItem[], pastedText: string) => void;
  onReset: () => void;
}

const STAGE_META = [
  { name: 'Analyst', desc: 'CWE / OWASP classification + false-positive reduction', icon: '/kit/analyze.svg' },
  { name: 'Translator', desc: 'Business-language impact & fixes', icon: '/kit/translate.svg' },
  { name: 'Synthesizer', desc: 'Final end-user report assembly', icon: '/kit/synthesize.svg' },
];

function StageCard({ idx, info }: { idx: number; info: StageInfo }) {
  const meta = STAGE_META[idx];
  const border =
    info.status === 'running'
      ? 'border-brand-500 shadow-lg shadow-brand-500/10'
      : info.status === 'done'
        ? 'border-teal-500/60'
        : info.status === 'demo'
          ? 'border-sev-medium/60'
        : info.status === 'error'
          ? 'border-sev-critical'
          : 'border-ink-600';
  return (
    <div className={`rounded-xl border ${border} bg-ink-800 p-4 transition-all`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={meta.icon} alt="" className="h-6 w-6" />
          <div>
            <p className="text-sm font-semibold text-mist-0">
              Stage {idx + 1} · {meta.name}
            </p>
            <p className="text-xs text-mist-400">{meta.desc}</p>
          </div>
        </div>
        {info.status === 'running' && (
          <svg className="spinner h-5 w-5 text-brand-500" viewBox="0 0 24 24" fill="none" aria-label="Running">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
        {info.status === 'done' && (
          <span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-semibold text-teal-500">done</span>
        )}
        {info.status === 'demo' && (
          <span className="rounded-full bg-sev-medium/15 px-2 py-0.5 text-xs font-semibold text-sev-medium">demo</span>
        )}
        {info.status === 'error' && (
          <span className="rounded-full bg-sev-critical/15 px-2 py-0.5 text-xs font-semibold text-sev-critical">failed</span>
        )}
        {info.status === 'idle' && (
          <span className="rounded-full bg-ink-700 px-2 py-0.5 text-xs text-mist-500">waiting</span>
        )}
      </div>
      {(info.status === 'running' || info.status === 'done') && info.keyIndex !== undefined && (
        <p className="mt-3 font-mono text-xs text-mist-400">
          key {info.keyIndex + 1} · {info.model}
          {info.durationMs !== undefined && ` · ${(info.durationMs / 1000).toFixed(1)}s`}
        </p>
      )}
    </div>
  );
}

export default function Analyzer({ stages, log, running, error, onRun, onReset }: AnalyzerProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [pasted, setPasted] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const accepted: File[] = [];
    const rejected: string[] = [];
    for (const f of Array.from(incoming)) {
      if (isBlocked(f.name)) rejected.push(`${f.name} — .exe / .dpkg / .apk are not accepted`);
      else accepted.push(f);
    }
    setFiles((prev) => {
      const names = new Set(prev.map((p) => p.name + p.size));
      return [...prev, ...accepted.filter((f) => !names.has(f.name + f.size))];
    });
    setFileErrors(rejected);
  }, []);

  const handleRun = async () => {
    const evidence: EvidenceItem[] = [];
    const errs: string[] = [];
    for (const f of files) {
      try {
        evidence.push(await fileToEvidence(f));
      } catch (e) {
        errs.push(e instanceof Error ? e.message : String(e));
      }
    }
    setFileErrors(errs);
    if (!evidence.length && !pasted.trim()) return;
    onRun(evidence, pasted);
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const canRun = !running && (files.length > 0 || pasted.trim().length > 0);

  return (
    <section id="analyze" className="border-t border-ink-600/60 bg-ink-800/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Analyze</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-mist-0">Drop your raw findings</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-400">
          Screenshots (PNG, JPEG), scanner exports (XML, JSON, CSV, HTML), HTTP request/response
          dumps, HAR files, logs, code snippets, PDFs — any evidence format works. Executables and
          installer packages (<code className="text-mist-100">.exe</code>,{' '}
          <code className="text-mist-100">.dpkg</code>, <code className="text-mist-100">.apk</code>)
          are the only formats rejected.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Input column */}
          <div className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload evidence files"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              className={`grid min-h-44 cursor-pointer place-items-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-ink-600 bg-ink-900/60 hover:border-mist-500'
              }`}
            >
              <div>
                <img src="/kit/upload.svg" alt="" className="mx-auto h-10 w-10" />
                <p className="mt-3 text-sm font-medium text-mist-100">
                  Drop evidence here, or <span className="text-brand-500 underline">browse files</span>
                </p>
                <p className="mt-1 text-xs text-mist-400">
                  png · jpg · xml · json · csv · har · log · txt · pdf · code — everything except exe / dpkg / apk
                </p>
              </div>
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
            </div>

            {files.length > 0 && (
              <ul className="space-y-2">
                {files.map((f) => (
                  <li
                    key={f.name + f.size}
                    className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm"
                  >
                    <span className="truncate font-mono text-xs text-mist-100">
                      {f.name} <span className="text-mist-500">({(f.size / 1024).toFixed(1)} KB)</span>
                    </span>
                    <button
                      onClick={() => setFiles((prev) => prev.filter((p) => p !== f))}
                      className="ml-3 text-mist-400 transition-colors hover:text-sev-critical"
                      aria-label={`Remove ${f.name}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {fileErrors.map((e) => (
              <p key={e} className="rounded-lg border border-sev-critical/40 bg-sev-critical/10 px-3 py-2 text-xs text-sev-critical">
                {e}
              </p>
            ))}

            <div>
              <label htmlFor="pasted" className="text-xs font-semibold uppercase tracking-wider text-mist-400">
                …or paste a raw finding
              </label>
              <textarea
                id="pasted"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                rows={8}
                placeholder={'POST /api/login HTTP/1.1\nHost: target.example\n…\n\nHTTP/1.1 200 OK\n…'}
                className="mt-2 w-full resize-y rounded-lg border border-ink-600 bg-mist-900 p-3 font-mono text-sm text-mist-100 placeholder:text-mist-500 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={!canRun}
                className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {running ? 'Pipeline running…' : 'Run 3-stage analysis →'}
              </button>
              {(running || log.length > 0) && (
                <button
                  onClick={() => {
                    onReset();
                  }}
                  className="rounded-lg border border-ink-600 px-4 py-3 text-sm font-medium text-mist-400 transition-colors hover:text-mist-0"
                >
                  Reset
                </button>
              )}
            </div>
            <p className="text-xs leading-relaxed text-mist-500">
              Privacy: evidence is sent directly from your browser to the Google Gemini API. Do not
              upload data covered by disclosure restrictions.
            </p>
          </div>

          {/* Status column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {stages.map((s, i) => (
                <StageCard key={i} idx={i} info={s} />
              ))}
            </div>
            {error && (
              <div className="rounded-xl border border-sev-critical/50 bg-sev-critical/10 p-4">
                <p className="text-sm font-semibold text-sev-critical">Pipeline error</p>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-mist-100">
                  {error}
                </pre>
              </div>
            )}
            <div className="rounded-xl border border-ink-600 bg-mist-900">
              <p className="border-b border-ink-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-mist-400">
                Orchestration log
              </p>
              <div className="max-h-64 min-h-32 overflow-auto p-4 font-mono text-xs leading-relaxed text-mist-100">
                {log.length === 0 ? (
                  <span className="text-mist-500">Waiting for evidence…</span>
                ) : (
                  log.map((l, i) => <p key={i}>{l}</p>)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

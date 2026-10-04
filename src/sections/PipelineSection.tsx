const STAGES = [
  {
    icon: '/kit/analyze.svg',
    stage: 'Stage 1 · Analyst',
    key: 'Gemini key 1',
    color: 'text-brand-500',
    ring: 'border-brand-500/40',
    body: 'Multimodal evidence interpretation. Classifies every finding under CWE and OWASP Top 10, assigns a CVSS v3.1 vector, and adjudicates false positives by demanding cited evidence plus counterfactual reasoning.',
    out: 'Verdict · confidence · CWE/OWASP · CVSS',
  },
  {
    icon: '/kit/translate.svg',
    stage: 'Stage 2 · Translator',
    key: 'Gemini key 2',
    color: 'text-teal-500',
    ring: 'border-teal-500/40',
    body: 'Receives the full Analyst output and rewrites it for two audiences: plain-language business impact and regulatory exposure for executives, ordered remediation steps and code examples for developers.',
    out: 'Executive summary · business fixes',
  },
  {
    icon: '/kit/synthesize.svg',
    stage: 'Stage 3 · Synthesizer',
    key: 'Gemini key 3',
    color: 'text-brand-500',
    ring: 'border-brand-500/40',
    body: 'Acts as quality gate: cross-checks both upstream outputs, flags contradictions and low-confidence items for human review, then assembles the final structured report ready for DOCX export.',
    out: 'Final report · review flags',
  },
];

export default function PipelineSection() {
  return (
    <section id="pipeline" className="border-t border-ink-600/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">How it works</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-mist-0">
          Three Gemini keys. Three specialists. One pipeline.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-400">
          Each stage runs on its own API key and passes its full output downstream — sequential
          with feedback, so every model's answer becomes evidence for the next. If a key stops
          responding, the query automatically rotates to a healthy key and the stage completes
          anyway.
        </p>

        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          <svg
            className="pointer-events-none absolute left-0 top-1/2 hidden h-8 w-full -translate-y-1/2 md:block"
            aria-hidden="true"
          >
            <line x1="5%" y1="16" x2="95%" y2="16" stroke="#2A3B52" strokeWidth="2" className="flow-line" />
          </svg>
          {STAGES.map((s, i) => (
            <article
              key={s.stage}
              className={`relative rounded-xl border ${s.ring} bg-ink-800 p-6 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <img src={s.icon} alt="" className="h-9 w-9" />
                <span className="rounded-full border border-ink-600 px-2.5 py-0.5 font-mono text-[11px] text-mist-400">
                  {s.key}
                </span>
              </div>
              <h3 className={`mt-4 text-lg font-semibold ${s.color}`}>{s.stage}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{s.body}</p>
              <p className="mt-4 border-t border-ink-600 pt-3 font-mono text-xs text-mist-100">
                → {s.out}
              </p>
              <span className="absolute -top-3 left-5 rounded-full bg-ink-900 px-2 font-mono text-xs text-mist-400">
                0{i + 1}
              </span>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-lg border border-ink-600 bg-ink-800/60 px-4 py-3 text-xs leading-relaxed text-mist-400">
          <strong className="text-mist-100">Failover rule:</strong> stage 1 prefers key 1, stage 2
          prefers key 2, stage 3 prefers key 3. On any error or timeout the request retries against
          the remaining keys in rotation — so a single dead or rate-limited key never kills your
          report.
        </p>
      </div>
    </section>
  );
}

export default function Hero() {
  return (
    <section id="top" className="bg-grid relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-500">
            Evidence-grounded · Multi-agent LLM framework
          </p>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-mist-0 sm:text-5xl">
            Raw findings in.
            <br />
            <span className="text-brand-500">Board-ready security report</span> out.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist-400">
            Scanners bury you in noise — up to 95% false positives. BugsCry pushes your raw
            evidence through three chained Gemini stages: an <strong className="text-mist-100">Analyst</strong> that
            classifies every finding under CWE &amp; OWASP and filters false positives, a{' '}
            <strong className="text-mist-100">Translator</strong> that rewrites fixes in business language, and a{' '}
            <strong className="text-mist-100">Synthesizer</strong> that assembles a professional DOCX report you can
            hand to clients the same day.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#analyze"
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-900 shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-600"
            >
              Analyze my findings →
            </a>
            <a
              href="#pipeline"
              className="rounded-lg border border-teal-500 px-6 py-3 text-sm font-semibold text-teal-500 transition-colors hover:bg-teal-500/10"
            >
              See the pipeline
            </a>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { k: '0.91', v: 'precision on validity checks' },
              { k: '0.87', v: 'recall · F1 = 0.89' },
              { k: '3-key', v: 'Gemini failover built in' },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-ink-600 bg-ink-800/70 px-3 py-3">
                <dt className="text-2xl font-bold text-mist-0">{s.k}</dt>
                <dd className="mt-1 text-xs leading-snug text-mist-400">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-brand-500/15 to-teal-500/15 blur-xl" />
          <img
            src="/kit/hero-banner.png"
            alt="BugsCry pipeline — evidence in, validated report out"
            className="relative w-full rounded-xl border border-ink-600 shadow-2xl"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}

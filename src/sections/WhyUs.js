"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WhyUs;
var REASONS = [
    {
        title: 'False positives, evicted',
        body: 'Every verdict must cite the exact evidence and survive a counterfactual test — "what would this look like if the bug were not there?" Claims without proof are routed to human review, not into your report.',
        accent: 'text-brand-500',
        border: 'hover:border-brand-500/60',
    },
    {
        title: 'Standards-native classification',
        body: 'Findings are mapped to precise CWE identifiers, OWASP Top 10 / API Top 10 categories, and CVSS v3.1 vectors — the language your clients, auditors, and ticketing systems already speak.',
        accent: 'text-teal-500',
        border: 'hover:border-teal-500/60',
    },
    {
        title: 'One report, two audiences',
        body: 'Executives get business impact, loss scenarios, and regulatory exposure. Developers get reproduction context and concrete fix steps. Interleaved in a single DOCX — no more writing the same report twice.',
        accent: 'text-brand-500',
        border: 'hover:border-brand-500/60',
    },
    {
        title: 'Resilient by design',
        body: 'Three independent Gemini API keys with automatic failover: if one key is rate-limited or down, the query instantly rotates to the next. The pipeline keeps moving even when a key does not.',
        accent: 'text-teal-500',
        border: 'hover:border-teal-500/60',
    },
];
function WhyUs() {
    return (<section id="why" className="border-t border-ink-600/60 bg-ink-800/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Why choose us</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight text-mist-0">
          Detection is cheap. <span className="text-brand-500">Validated, explainable answers</span> are not.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist-400">
          BugsCry is built on a peer-reviewed-style framework: evidence anchoring, counterfactual
          reasoning, confidence calibration, and a human review gate for anything below 70%
          confidence. You keep the judgment — we remove the grind.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map(function (r) { return (<article key={r.title} className={"rounded-xl border border-ink-600 bg-ink-800 p-5 shadow transition-colors ".concat(r.border)}>
              <h3 className={"text-base font-semibold ".concat(r.accent)}>{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mist-400">{r.body}</p>
            </article>); })}
        </div>
      </div>
    </section>);
}

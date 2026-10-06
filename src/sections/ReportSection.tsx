import { useState } from 'react';
import { exportReportDocx } from '@/lib/docxExport';
import type { FinalReport } from '@/types';

const SEV_STYLE: Record<string, string> = {
  Critical: 'bg-sev-critical/15 text-sev-critical border-sev-critical/40',
  High: 'bg-sev-high/15 text-sev-high border-sev-high/40',
  Medium: 'bg-sev-medium/15 text-sev-medium border-sev-medium/40',
  Low: 'bg-sev-low/15 text-sev-low border-sev-low/40',
  Informational: 'bg-info-500/15 text-blue-400 border-blue-400/40',
};

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className ?? 'border-ink-600 text-mist-100'}`}>
      {children}
    </span>
  );
}

export default function ReportSection({
  report,
  running,
  demo,
  reviewed,
  onMarkReviewed,
}: {
  report: FinalReport | null;
  running: boolean;
  demo: boolean;
  reviewed: boolean;
  onMarkReviewed: () => void;
}) {
  const [exporting, setExporting] = useState(false);

  const download = async () => {
    if (!report || !reviewed) return;
    setExporting(true);
    try {
      await exportReportDocx(report);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section id="report" className="border-t border-ink-600/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Output</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-mist-0">Your report</h2>

        {!report && (
          <div className="mt-8 grid min-h-40 place-items-center rounded-xl border border-dashed border-ink-600 bg-ink-800/50 p-8 text-center">
            <p className="max-w-md text-sm text-mist-400">
              {running
                ? 'The pipeline is working — the synthesized report will appear here when stage 3 completes.'
                : 'Run the analysis above and your finished, dual-audience security report will be rendered here, ready to download as .docx.'}
            </p>
          </div>
        )}

        {report && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-ink-600 bg-ink-800 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-mist-0">{report.reportTitle}</h3>
                  <p className="mt-1 text-xs text-mist-400">
                    Generated {new Date().toLocaleString()} · BugsCry evidence-grounded pipeline
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={SEV_STYLE[report.overallRiskRating] ?? ''}>
                    Overall risk: {report.overallRiskRating}
                  </Badge>
                  <button
                    onClick={download}
                    disabled={exporting || !reviewed}
                    className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-600 disabled:opacity-50"
                  >
                    {exporting ? 'Building DOCX…' : reviewed ? '⬇ Download .docx' : 'Review before download'}
                  </button>
                </div>
              </div>
              {demo && (
                <div className="mt-4 rounded-lg border border-sev-medium/50 bg-sev-medium/10 px-4 py-3 text-sm text-mist-100">
                  <strong className="text-sev-medium">Synthetic preview only.</strong> Gemini rejected the deployed API keys. No uploaded evidence was analyzed; replace the deployment keys and rerun for a real report.
                </div>
              )}
              <p className="mt-4 text-sm leading-relaxed text-mist-100">{report.executiveSummary}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Total', report.statistics.total],
                  ['True positives', report.statistics.truePositives],
                  ['False positives', report.statistics.falsePositives],
                  ['Informational', report.statistics.informational],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-center">
                    <dt className="text-xs text-mist-400">{k}</dt>
                    <dd className="text-xl font-bold text-mist-0">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {report.reviewFlags.length > 0 && (
              <div className="rounded-xl border border-sev-high/50 bg-sev-high/10 p-5">
                <p className="text-sm font-semibold text-sev-high">⚠ Routed to human review</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mist-100">
                  {report.reviewFlags.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-brand-500/40 bg-ink-800 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-mist-0">Human review</p>
                  <p className="mt-1 text-sm text-mist-400">
                    {reviewed
                      ? 'Review acknowledged. The report can now be downloaded.'
                      : 'Inspect the report records and review flags before enabling the DOCX download.'}
                  </p>
                </div>
                {!reviewed && (
                  <button
                    onClick={onMarkReviewed}
                    className="rounded-lg border border-brand-500 px-4 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-500/10"
                  >
                    Mark reviewed
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-mist-400">
                Records · {report.findings.length} finding{report.findings.length === 1 ? '' : 's'}
              </h4>
              {report.findings.map((f, i) => (
                <article key={i} className="rounded-xl border border-ink-600 bg-ink-800 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-mist-0">
                      {i + 1}. {f.title}
                    </h4>
                    <Badge className={SEV_STYLE[f.severity] ?? ''}>{f.severity}</Badge>
                    <Badge
                      className={
                        f.verdict === 'false_positive'
                          ? 'border-blue-400/40 bg-blue-400/10 text-blue-400'
                          : 'border-teal-500/40 bg-teal-500/10 text-teal-500'
                      }
                    >
                      {f.verdict.replace(/_/g, ' ')}
                    </Badge>
                    {f.confidence < 70 && (
                      <Badge className="border-sev-high/40 bg-sev-high/10 text-sev-high">
                        confidence {f.confidence} — needs review
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 font-mono text-xs text-mist-400">
                    {f.cwe} · {f.owasp} · {f.cvssVector}
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">Business impact</p>
                      <p className="mt-1 text-sm leading-relaxed text-mist-100">{f.businessImpact}</p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-teal-500">Executive note</p>
                      <p className="mt-1 text-sm leading-relaxed text-mist-400">{f.executiveNote}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">Evidence</p>
                      <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap rounded-lg bg-mist-900 p-3 font-mono text-xs text-mist-100">
                        {f.evidence}
                      </pre>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-500">Remediation</p>
                      <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-mist-100">
                        {f.remediation.map((r, j) => (
                          <li key={j}>{r}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {report.recommendations.length > 0 && (
              <div className="rounded-xl border border-ink-600 bg-ink-800 p-6">
                <h4 className="text-base font-semibold text-mist-0">Prioritized recommendations</h4>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-mist-100">
                  {report.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={download}
                disabled={exporting || !reviewed}
                className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-600 disabled:opacity-50"
              >
                {exporting ? 'Building DOCX…' : reviewed ? '⬇ Download full report (.docx)' : 'Review before download'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

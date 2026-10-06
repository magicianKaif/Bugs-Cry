"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReportSection;
var react_1 = require("react");
var docxExport_1 = require("@/lib/docxExport");
var SEV_STYLE = {
    Critical: 'bg-sev-critical/15 text-sev-critical border-sev-critical/40',
    High: 'bg-sev-high/15 text-sev-high border-sev-high/40',
    Medium: 'bg-sev-medium/15 text-sev-medium border-sev-medium/40',
    Low: 'bg-sev-low/15 text-sev-low border-sev-low/40',
    Informational: 'bg-info-500/15 text-blue-400 border-blue-400/40',
};
function Badge(_a) {
    var children = _a.children, className = _a.className;
    return (<span className={"inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ".concat(className !== null && className !== void 0 ? className : 'border-ink-600 text-mist-100')}>
      {children}
    </span>);
}
function ReportSection(_a) {
    var _this = this;
    var _b;
    var report = _a.report, running = _a.running;
    var _c = (0, react_1.useState)(false), exporting = _c[0], setExporting = _c[1];
    var download = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!report)
                        return [2 /*return*/];
                    setExporting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, (0, docxExport_1.exportReportDocx)(report)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    setExporting(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<section id="report" className="border-t border-ink-600/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-500">Output</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-mist-0">Your report</h2>

        {!report && (<div className="mt-8 grid min-h-40 place-items-center rounded-xl border border-dashed border-ink-600 bg-ink-800/50 p-8 text-center">
            <p className="max-w-md text-sm text-mist-400">
              {running
                ? 'The pipeline is working — the synthesized report will appear here when stage 3 completes.'
                : 'Run the analysis above and your finished, dual-audience security report will be rendered here, ready to download as .docx.'}
            </p>
          </div>)}

        {report && (<div className="mt-8 space-y-6">
            <div className="rounded-xl border border-ink-600 bg-ink-800 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-mist-0">{report.reportTitle}</h3>
                  <p className="mt-1 text-xs text-mist-400">
                    Generated {new Date().toLocaleString()} · BugsCry evidence-grounded pipeline
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={(_b = SEV_STYLE[report.overallRiskRating]) !== null && _b !== void 0 ? _b : ''}>
                    Overall risk: {report.overallRiskRating}
                  </Badge>
                  <button onClick={download} disabled={exporting} className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-600 disabled:opacity-50">
                    {exporting ? 'Building DOCX…' : '⬇ Download .docx'}
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-mist-100">{report.executiveSummary}</p>

              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                ['Total', report.statistics.total],
                ['True positives', report.statistics.truePositives],
                ['False positives', report.statistics.falsePositives],
                ['Informational', report.statistics.informational],
            ].map(function (_a) {
                var k = _a[0], v = _a[1];
                return (<div key={k} className="rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-center">
                    <dt className="text-xs text-mist-400">{k}</dt>
                    <dd className="text-xl font-bold text-mist-0">{v}</dd>
                  </div>);
            })}
              </dl>
            </div>

            {report.reviewFlags.length > 0 && (<div className="rounded-xl border border-sev-high/50 bg-sev-high/10 p-5">
                <p className="text-sm font-semibold text-sev-high">⚠ Routed to human review</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-mist-100">
                  {report.reviewFlags.map(function (f, i) { return (<li key={i}>{f}</li>); })}
                </ul>
              </div>)}

            <div className="space-y-4">
              {report.findings.map(function (f, i) {
                var _a;
                return (<article key={i} className="rounded-xl border border-ink-600 bg-ink-800 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-mist-0">
                      {i + 1}. {f.title}
                    </h4>
                    <Badge className={(_a = SEV_STYLE[f.severity]) !== null && _a !== void 0 ? _a : ''}>{f.severity}</Badge>
                    <Badge className={f.verdict === 'false_positive'
                        ? 'border-blue-400/40 bg-blue-400/10 text-blue-400'
                        : 'border-teal-500/40 bg-teal-500/10 text-teal-500'}>
                      {f.verdict.replace(/_/g, ' ')}
                    </Badge>
                    {f.confidence < 70 && (<Badge className="border-sev-high/40 bg-sev-high/10 text-sev-high">
                        confidence {f.confidence} — needs review
                      </Badge>)}
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
                        {f.remediation.map(function (r, j) { return (<li key={j}>{r}</li>); })}
                      </ol>
                    </div>
                  </div>
                </article>);
            })}
            </div>

            {report.recommendations.length > 0 && (<div className="rounded-xl border border-ink-600 bg-ink-800 p-6">
                <h4 className="text-base font-semibold text-mist-0">Prioritized recommendations</h4>
                <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-mist-100">
                  {report.recommendations.map(function (r, i) { return (<li key={i}>{r}</li>); })}
                </ol>
              </div>)}

            <div className="flex justify-end">
              <button onClick={download} disabled={exporting} className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-600 disabled:opacity-50">
                {exporting ? 'Building DOCX…' : '⬇ Download full report (.docx)'}
              </button>
            </div>
          </div>)}
      </div>
    </section>);
}

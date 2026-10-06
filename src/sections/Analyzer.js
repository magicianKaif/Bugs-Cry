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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Analyzer;
var react_1 = require("react");
var files_1 = require("@/lib/files");
var STAGE_META = [
    { name: 'Analyst', desc: 'CWE / OWASP classification + false-positive reduction', icon: '/kit/analyze.svg' },
    { name: 'Translator', desc: 'Business-language impact & fixes', icon: '/kit/translate.svg' },
    { name: 'Synthesizer', desc: 'Final end-user report assembly', icon: '/kit/synthesize.svg' },
];
function StageCard(_a) {
    var idx = _a.idx, info = _a.info;
    var meta = STAGE_META[idx];
    var border = info.status === 'running'
        ? 'border-brand-500 shadow-lg shadow-brand-500/10'
        : info.status === 'done'
            ? 'border-teal-500/60'
            : info.status === 'error'
                ? 'border-sev-critical'
                : 'border-ink-600';
    return (<div className={"rounded-xl border ".concat(border, " bg-ink-800 p-4 transition-all")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={meta.icon} alt="" className="h-6 w-6"/>
          <div>
            <p className="text-sm font-semibold text-mist-0">
              Stage {idx + 1} · {meta.name}
            </p>
            <p className="text-xs text-mist-400">{meta.desc}</p>
          </div>
        </div>
        {info.status === 'running' && (<svg className="spinner h-5 w-5 text-brand-500" viewBox="0 0 24 24" fill="none" aria-label="Running">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3"/>
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>)}
        {info.status === 'done' && (<span className="rounded-full bg-teal-500/15 px-2 py-0.5 text-xs font-semibold text-teal-500">done</span>)}
        {info.status === 'error' && (<span className="rounded-full bg-sev-critical/15 px-2 py-0.5 text-xs font-semibold text-sev-critical">failed</span>)}
        {info.status === 'idle' && (<span className="rounded-full bg-ink-700 px-2 py-0.5 text-xs text-mist-500">waiting</span>)}
      </div>
      {(info.status === 'running' || info.status === 'done') && info.keyIndex !== undefined && (<p className="mt-3 font-mono text-xs text-mist-400">
          key {info.keyIndex + 1} · {info.model}
          {info.durationMs !== undefined && " \u00B7 ".concat((info.durationMs / 1000).toFixed(1), "s")}
        </p>)}
    </div>);
}
function Analyzer(_a) {
    var _this = this;
    var stages = _a.stages, log = _a.log, running = _a.running, error = _a.error, onRun = _a.onRun, onReset = _a.onReset;
    var _b = (0, react_1.useState)([]), files = _b[0], setFiles = _b[1];
    var _c = (0, react_1.useState)([]), fileErrors = _c[0], setFileErrors = _c[1];
    var _d = (0, react_1.useState)(''), pasted = _d[0], setPasted = _d[1];
    var _e = (0, react_1.useState)(false), dragOver = _e[0], setDragOver = _e[1];
    var inputRef = (0, react_1.useRef)(null);
    var addFiles = (0, react_1.useCallback)(function (incoming) {
        var accepted = [];
        var rejected = [];
        for (var _i = 0, _a = Array.from(incoming); _i < _a.length; _i++) {
            var f = _a[_i];
            if ((0, files_1.isBlocked)(f.name))
                rejected.push("".concat(f.name, " \u2014 .exe / .dpkg / .apk are not accepted"));
            else
                accepted.push(f);
        }
        setFiles(function (prev) {
            var names = new Set(prev.map(function (p) { return p.name + p.size; }));
            return __spreadArray(__spreadArray([], prev, true), accepted.filter(function (f) { return !names.has(f.name + f.size); }), true);
        });
        setFileErrors(rejected);
    }, []);
    var handleRun = function () { return __awaiter(_this, void 0, void 0, function () {
        var evidence, errs, _i, files_2, f, _a, _b, e_1;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    evidence = [];
                    errs = [];
                    _i = 0, files_2 = files;
                    _d.label = 1;
                case 1:
                    if (!(_i < files_2.length)) return [3 /*break*/, 6];
                    f = files_2[_i];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    _b = (_a = evidence).push;
                    return [4 /*yield*/, (0, files_1.fileToEvidence)(f)];
                case 3:
                    _b.apply(_a, [_d.sent()]);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _d.sent();
                    errs.push(e_1 instanceof Error ? e_1.message : String(e_1));
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6:
                    setFileErrors(errs);
                    if (!evidence.length && !pasted.trim())
                        return [2 /*return*/];
                    onRun(evidence, pasted);
                    (_c = document.getElementById('report')) === null || _c === void 0 ? void 0 : _c.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return [2 /*return*/];
            }
        });
    }); };
    var canRun = !running && (files.length > 0 || pasted.trim().length > 0);
    return (<section id="analyze" className="border-t border-ink-600/60 bg-ink-800/40">
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
            <div role="button" tabIndex={0} aria-label="Upload evidence files" onClick={function () { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} onKeyDown={function (e) { var _a; return e.key === 'Enter' && ((_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click()); }} onDragOver={function (e) {
            e.preventDefault();
            setDragOver(true);
        }} onDragLeave={function () { return setDragOver(false); }} onDrop={function (e) {
            e.preventDefault();
            setDragOver(false);
            addFiles(e.dataTransfer.files);
        }} className={"grid min-h-44 cursor-pointer place-items-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ".concat(dragOver ? 'border-brand-500 bg-brand-500/10' : 'border-ink-600 bg-ink-900/60 hover:border-mist-500')}>
              <div>
                <img src="/kit/upload.svg" alt="" className="mx-auto h-10 w-10"/>
                <p className="mt-3 text-sm font-medium text-mist-100">
                  Drop evidence here, or <span className="text-brand-500 underline">browse files</span>
                </p>
                <p className="mt-1 text-xs text-mist-400">
                  png · jpg · xml · json · csv · har · log · txt · pdf · code — everything except exe / dpkg / apk
                </p>
              </div>
              <input ref={inputRef} type="file" multiple className="hidden" onChange={function (e) { return e.target.files && addFiles(e.target.files); }}/>
            </div>

            {files.length > 0 && (<ul className="space-y-2">
                {files.map(function (f) { return (<li key={f.name + f.size} className="flex items-center justify-between rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm">
                    <span className="truncate font-mono text-xs text-mist-100">
                      {f.name} <span className="text-mist-500">({(f.size / 1024).toFixed(1)} KB)</span>
                    </span>
                    <button onClick={function () { return setFiles(function (prev) { return prev.filter(function (p) { return p !== f; }); }); }} className="ml-3 text-mist-400 transition-colors hover:text-sev-critical" aria-label={"Remove ".concat(f.name)}>
                      ✕
                    </button>
                  </li>); })}
              </ul>)}

            {fileErrors.map(function (e) { return (<p key={e} className="rounded-lg border border-sev-critical/40 bg-sev-critical/10 px-3 py-2 text-xs text-sev-critical">
                {e}
              </p>); })}

            <div>
              <label htmlFor="pasted" className="text-xs font-semibold uppercase tracking-wider text-mist-400">
                …or paste a raw finding
              </label>
              <textarea id="pasted" value={pasted} onChange={function (e) { return setPasted(e.target.value); }} rows={8} placeholder={'POST /api/login HTTP/1.1\nHost: target.example\n…\n\nHTTP/1.1 200 OK\n…'} className="mt-2 w-full resize-y rounded-lg border border-ink-600 bg-mist-900 p-3 font-mono text-sm text-mist-100 placeholder:text-mist-500 focus:border-brand-500 focus:outline-none"/>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleRun} disabled={!canRun} className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-900 transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40">
                {running ? 'Pipeline running…' : 'Run 3-stage analysis →'}
              </button>
              {(running || log.length > 0) && (<button onClick={function () {
                onReset();
            }} className="rounded-lg border border-ink-600 px-4 py-3 text-sm font-medium text-mist-400 transition-colors hover:text-mist-0">
                  Reset
                </button>)}
            </div>
            <p className="text-xs leading-relaxed text-mist-500">
              Privacy: evidence is sent directly from your browser to the Google Gemini API. Do not
              upload data covered by disclosure restrictions.
            </p>
          </div>

          {/* Status column */}
          <div className="space-y-4">
            <div className="space-y-3">
              {stages.map(function (s, i) { return (<StageCard key={i} idx={i} info={s}/>); })}
            </div>
            {error && (<div className="rounded-xl border border-sev-critical/50 bg-sev-critical/10 p-4">
                <p className="text-sm font-semibold text-sev-critical">Pipeline error</p>
                <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap font-mono text-xs text-mist-100">
                  {error}
                </pre>
              </div>)}
            <div className="rounded-xl border border-ink-600 bg-mist-900">
              <p className="border-b border-ink-600 px-4 py-2 font-mono text-xs uppercase tracking-wider text-mist-400">
                Orchestration log
              </p>
              <div className="max-h-64 min-h-32 overflow-auto p-4 font-mono text-xs leading-relaxed text-mist-100">
                {log.length === 0 ? (<span className="text-mist-500">Waiting for evidence…</span>) : (log.map(function (l, i) { return <p key={i}>{l}</p>; }))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);
}

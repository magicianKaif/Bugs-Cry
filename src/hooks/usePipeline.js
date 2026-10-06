"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.usePipeline = usePipeline;
var react_1 = require("react");
var gemini_1 = require("@/lib/gemini");
var files_1 = require("@/lib/files");
var prompts_1 = require("@/lib/prompts");
var IDLE_STAGES = [
    { status: 'idle' },
    { status: 'idle' },
    { status: 'idle' },
];
function usePipeline() {
    var _this = this;
    var _a = (0, react_1.useState)({
        stages: IDLE_STAGES,
        log: [],
        running: false,
        error: null,
        analyst: null,
        translator: null,
        report: null,
    }), state = _a[0], setState = _a[1];
    var abortRef = (0, react_1.useRef)(null);
    var appendLog = (0, react_1.useCallback)(function (line) {
        var stamp = new Date().toLocaleTimeString();
        setState(function (s) { return (__assign(__assign({}, s), { log: __spreadArray(__spreadArray([], s.log, true), ["[".concat(stamp, "] ").concat(line)], false) })); });
    }, []);
    var setStage = (0, react_1.useCallback)(function (idx, info) {
        setState(function (s) {
            var stages = s.stages.map(function (st, i) { return (i === idx ? __assign(__assign({}, st), info) : st); });
            return __assign(__assign({}, s), { stages: stages });
        });
    }, []);
    var reset = (0, react_1.useCallback)(function () {
        var _a;
        (_a = abortRef.current) === null || _a === void 0 ? void 0 : _a.abort();
        setState({
            stages: IDLE_STAGES,
            log: [],
            running: false,
            error: null,
            analyst: null,
            translator: null,
            report: null,
        });
    }, []);
    var run = (0, react_1.useCallback)(function (evidence, pastedText) { return __awaiter(_this, void 0, void 0, function () {
        var controller, evidenceParts, onAttempt, t1, _a, analyst_1, m1, n, t2, _b, translator_1, m2, t3, _c, report_1, m3, err_1, msg_1;
        var _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (_d = abortRef.current) === null || _d === void 0 ? void 0 : _d.abort();
                    controller = new AbortController();
                    abortRef.current = controller;
                    setState({
                        stages: IDLE_STAGES,
                        log: [],
                        running: true,
                        error: null,
                        analyst: null,
                        translator: null,
                        report: null,
                    });
                    evidenceParts = (0, files_1.evidenceToParts)(evidence, pastedText);
                    appendLog("Pipeline started \u2014 ".concat(evidence.length, " file(s), ").concat(pastedText.trim() ? '1 pasted finding' : 'no pasted text', "."));
                    onAttempt = function (stageIdx) { return function (keyIndex, model) {
                        setStage(stageIdx, { status: 'running', keyIndex: keyIndex, model: model });
                        appendLog("Stage ".concat(stageIdx + 1, ": trying key ").concat(keyIndex + 1, " (").concat(model, ")\u2026"));
                    }; };
                    _l.label = 1;
                case 1:
                    _l.trys.push([1, 5, , 6]);
                    // ── Stage 1 · Analyst (key 1) ────────────────────────────────
                    appendLog('Stage 1 · Analyst — classifying under CWE/OWASP, adjudicating false positives…');
                    t1 = performance.now();
                    return [4 /*yield*/, (0, gemini_1.callGeminiJson)(0, __spreadArray([{ text: (0, prompts_1.buildAnalystPrompt)() }], evidenceParts, true), { onAttempt: onAttempt(0), signal: controller.signal })];
                case 2:
                    _a = _l.sent(), analyst_1 = _a.json, m1 = _a.meta;
                    setStage(0, {
                        status: 'done',
                        keyIndex: m1.keyIndex,
                        model: m1.model,
                        durationMs: Math.round(performance.now() - t1),
                    });
                    n = (_f = (_e = analyst_1.findings) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0;
                    appendLog("Stage 1 done via key ".concat(m1.keyIndex + 1, " \u2014 ").concat(n, " finding(s), ").concat((_h = (_g = analyst_1.findings) === null || _g === void 0 ? void 0 : _g.filter(function (f) { return f.verdict === 'false_positive'; }).length) !== null && _h !== void 0 ? _h : 0, " flagged false-positive."));
                    if (!n) {
                        appendLog('No security-relevant findings in the evidence. Pipeline stopped.');
                        setState(function (s) { return (__assign(__assign({}, s), { running: false, analyst: analyst_1 })); });
                        return [2 /*return*/];
                    }
                    // ── Stage 2 · Translator (key 2) ─────────────────────────────
                    appendLog('Stage 2 · Translator — rewriting fixes in business language…');
                    t2 = performance.now();
                    return [4 /*yield*/, (0, gemini_1.callGeminiJson)(1, [{ text: (0, prompts_1.buildTranslatorPrompt)(analyst_1) }], { onAttempt: onAttempt(1), signal: controller.signal })];
                case 3:
                    _b = _l.sent(), translator_1 = _b.json, m2 = _b.meta;
                    setStage(1, {
                        status: 'done',
                        keyIndex: m2.keyIndex,
                        model: m2.model,
                        durationMs: Math.round(performance.now() - t2),
                    });
                    appendLog("Stage 2 done via key ".concat(m2.keyIndex + 1, " \u2014 dual-audience content generated."));
                    // ── Stage 3 · Synthesizer (key 3) ────────────────────────────
                    appendLog('Stage 3 · Synthesizer — assembling the end-user report…');
                    t3 = performance.now();
                    return [4 /*yield*/, (0, gemini_1.callGeminiJson)(2, [{ text: (0, prompts_1.buildReportPrompt)(analyst_1, translator_1) }], { onAttempt: onAttempt(2), signal: controller.signal, maxOutputTokens: 16384 })];
                case 4:
                    _c = _l.sent(), report_1 = _c.json, m3 = _c.meta;
                    setStage(2, {
                        status: 'done',
                        keyIndex: m3.keyIndex,
                        model: m3.model,
                        durationMs: Math.round(performance.now() - t3),
                    });
                    appendLog("Stage 3 done via key ".concat(m3.keyIndex + 1, " \u2014 report ready (").concat((_k = (_j = report_1.findings) === null || _j === void 0 ? void 0 : _j.length) !== null && _k !== void 0 ? _k : 0, " findings, overall risk: ").concat(report_1.overallRiskRating, ")."));
                    setState(function (s) { return (__assign(__assign({}, s), { running: false, analyst: analyst_1, translator: translator_1, report: report_1 })); });
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _l.sent();
                    msg_1 = err_1 instanceof Error ? err_1.message : String(err_1);
                    appendLog("Pipeline failed: ".concat(msg_1));
                    setState(function (s) { return (__assign(__assign({}, s), { running: false, error: msg_1, stages: s.stages.map(function (st) { return (st.status === 'running' ? __assign(__assign({}, st), { status: 'error' }) : st); }) })); });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [appendLog, setStage]);
    return __assign(__assign({}, state), { run: run, reset: reset });
}

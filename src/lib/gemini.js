"use strict";
/**
 * Gemini client with three-key rotation.
 *
 * Key roles (per product spec):
 *   key 0 → Stage 1 Analyst    (OWASP/CWE classification + false-positive reduction)
 *   key 1 → Stage 2 Translator (business-language fixes)
 *   key 2 → Stage 3 Synthesizer (final end-user report)
 *
 * If a stage's preferred key fails (network error, 4xx/5xx, quota), the call
 * automatically falls over to the remaining keys, so the pipeline keeps moving.
 */
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
exports.KEY_LABELS = exports.GEMINI_KEYS = void 0;
exports.parseJsonLoose = parseJsonLoose;
exports.callGeminiJson = callGeminiJson;
exports.GEMINI_KEYS = [
    import.meta.env.VITE_GEMINI_API_KEY_ANALYST,
    import.meta.env.VITE_GEMINI_API_KEY_TRANSLATOR,
    import.meta.env.VITE_GEMINI_API_KEY_SYNTHESIZER,
];
exports.KEY_LABELS = ['Analyst key', 'Translator key', 'Synthesizer key'];
var MODEL_CANDIDATES = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
var TIMEOUT_MS = 120000;
function postToGemini(key, model, parts, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var url, controller, timer, linkAbort, res, body, data, text;
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    url = "https://generativelanguage.googleapis.com/v1beta/models/".concat(model, ":generateContent?key=").concat(encodeURIComponent(key));
                    controller = new AbortController();
                    timer = setTimeout(function () { return controller.abort(); }, TIMEOUT_MS);
                    linkAbort = function () { return controller.abort(); };
                    (_a = opts.signal) === null || _a === void 0 ? void 0 : _a.addEventListener('abort', linkAbort);
                    _j.label = 1;
                case 1:
                    _j.trys.push([1, , 6, 7]);
                    return [4 /*yield*/, fetch(url, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            signal: controller.signal,
                            body: JSON.stringify({
                                contents: [{ role: 'user', parts: parts }],
                                generationConfig: {
                                    temperature: (_b = opts.temperature) !== null && _b !== void 0 ? _b : 0.2,
                                    maxOutputTokens: (_c = opts.maxOutputTokens) !== null && _c !== void 0 ? _c : 8192,
                                    responseMimeType: 'application/json',
                                },
                            }),
                        })];
                case 2:
                    res = _j.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.text().catch(function () { return ''; })];
                case 3:
                    body = _j.sent();
                    throw new Error("HTTP ".concat(res.status, " ").concat(res.statusText, " \u2014 ").concat(body.slice(0, 220)));
                case 4: return [4 /*yield*/, res.json()];
                case 5:
                    data = _j.sent();
                    text = ((_g = (_f = (_e = (_d = data === null || data === void 0 ? void 0 : data.candidates) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.content) === null || _f === void 0 ? void 0 : _f.parts) !== null && _g !== void 0 ? _g : [])
                        .map(function (p) { var _a; return (_a = p.text) !== null && _a !== void 0 ? _a : ''; })
                        .join('');
                    if (!text)
                        throw new Error('Empty response from model');
                    return [2 /*return*/, text];
                case 6:
                    clearTimeout(timer);
                    (_h = opts.signal) === null || _h === void 0 ? void 0 : _h.removeEventListener('abort', linkAbort);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    });
}
/** Extract the first JSON object/array from a model response, tolerating code fences. */
function parseJsonLoose(raw) {
    var s = raw.trim();
    var fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence)
        s = fence[1].trim();
    try {
        return JSON.parse(s);
    }
    catch (_a) {
        var start = s.search(/[{[]/);
        var end = Math.max(s.lastIndexOf('}'), s.lastIndexOf(']'));
        if (start >= 0 && end > start) {
            return JSON.parse(s.slice(start, end + 1));
        }
        throw new Error('Model returned non-JSON output');
    }
}
/**
 * Call Gemini for a pipeline stage. Tries the stage's own key first, then the
 * other keys in rotation; for each key it walks the model candidates.
 */
function callGeminiJson(stageIndex_1, parts_1) {
    return __awaiter(this, arguments, void 0, function (stageIndex, parts, opts) {
        var keyOrder, attempts, lastError, _i, keyOrder_1, keyIndex, _a, MODEL_CANDIDATES_1, model, started, raw, json, err_1;
        var _b, _c;
        if (opts === void 0) { opts = {}; }
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    keyOrder = [0, 1, 2].map(function (i) { return (stageIndex + i) % exports.GEMINI_KEYS.length; });
                    attempts = [];
                    lastError = null;
                    _i = 0, keyOrder_1 = keyOrder;
                    _d.label = 1;
                case 1:
                    if (!(_i < keyOrder_1.length)) return [3 /*break*/, 8];
                    keyIndex = keyOrder_1[_i];
                    _a = 0, MODEL_CANDIDATES_1 = MODEL_CANDIDATES;
                    _d.label = 2;
                case 2:
                    if (!(_a < MODEL_CANDIDATES_1.length)) return [3 /*break*/, 7];
                    model = MODEL_CANDIDATES_1[_a];
                    if ((_b = opts.signal) === null || _b === void 0 ? void 0 : _b.aborted)
                        throw new Error('Cancelled');
                    (_c = opts.onAttempt) === null || _c === void 0 ? void 0 : _c.call(opts, keyIndex, model);
                    started = performance.now();
                    _d.label = 3;
                case 3:
                    _d.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, postToGemini(exports.GEMINI_KEYS[keyIndex], model, parts, opts)];
                case 4:
                    raw = _d.sent();
                    json = parseJsonLoose(raw);
                    return [2 /*return*/, {
                            json: json,
                            meta: { keyIndex: keyIndex, model: model, durationMs: Math.round(performance.now() - started), attempts: attempts },
                        }];
                case 5:
                    err_1 = _d.sent();
                    lastError = err_1;
                    attempts.push("key ".concat(keyIndex + 1, " / ").concat(model, ": ").concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                    return [3 /*break*/, 6];
                case 6:
                    _a++;
                    return [3 /*break*/, 2];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: throw new Error("All Gemini keys/models failed for this stage.\n".concat(attempts.join('\n')).concat(lastError ? "\nLast error: ".concat(String(lastError)) : ''));
            }
        });
    });
}

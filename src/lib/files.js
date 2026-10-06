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
exports.BLOCKED_EXTENSIONS = void 0;
exports.extOf = extOf;
exports.isBlocked = isBlocked;
exports.fileToEvidence = fileToEvidence;
exports.evidenceToParts = evidenceToParts;
/** Executables/installers are never accepted. Everything else is fair game. */
exports.BLOCKED_EXTENSIONS = ['exe', 'dpkg', 'apk'];
var IMAGE_MIMES = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
};
var MAX_TEXT_BYTES = 400 * 1024; // keep prompts within sane token limits
var MAX_FILE_BYTES = 8 * 1024 * 1024;
function extOf(name) {
    var m = name.toLowerCase().match(/\.([a-z0-9]+)$/);
    return m ? m[1] : '';
}
function isBlocked(name) {
    return exports.BLOCKED_EXTENSIONS.includes(extOf(name));
}
function readAsDataURL(file) {
    return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { return resolve(String(r.result)); };
        r.onerror = function () { return reject(new Error("Could not read ".concat(file.name))); };
        r.readAsDataURL(file);
    });
}
function readAsText(file) {
    return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { return resolve(String(r.result)); };
        r.onerror = function () { return reject(new Error("Could not read ".concat(file.name))); };
        r.readAsText(file);
    });
}
function fileToEvidence(file) {
    return __awaiter(this, void 0, void 0, function () {
        var ext, dataUrl, dataUrl, text;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (isBlocked(file.name)) {
                        throw new Error("".concat(file.name, ": executables and installer packages (.exe / .dpkg / .apk) are not accepted."));
                    }
                    if (file.size > MAX_FILE_BYTES) {
                        throw new Error("".concat(file.name, ": file exceeds the 8 MB limit."));
                    }
                    ext = extOf(file.name);
                    if (!(IMAGE_MIMES[ext] || file.type.startsWith('image/'))) return [3 /*break*/, 2];
                    return [4 /*yield*/, readAsDataURL(file)];
                case 1:
                    dataUrl = _d.sent();
                    return [2 /*return*/, {
                            name: file.name,
                            mimeType: (_a = IMAGE_MIMES[ext]) !== null && _a !== void 0 ? _a : file.type,
                            kind: 'image',
                            data: (_b = dataUrl.split(',')[1]) !== null && _b !== void 0 ? _b : '',
                        }];
                case 2:
                    if (!(ext === 'pdf' || file.type === 'application/pdf')) return [3 /*break*/, 4];
                    return [4 /*yield*/, readAsDataURL(file)];
                case 3:
                    dataUrl = _d.sent();
                    return [2 /*return*/, { name: file.name, mimeType: 'application/pdf', kind: 'pdf', data: (_c = dataUrl.split(',')[1]) !== null && _c !== void 0 ? _c : '' }];
                case 4: return [4 /*yield*/, readAsText(file)];
                case 5:
                    text = _d.sent();
                    if (new Blob([text]).size > MAX_TEXT_BYTES) {
                        text = "".concat(text.slice(0, MAX_TEXT_BYTES), "\n\u2026 [truncated at 400 KB]");
                    }
                    return [2 /*return*/, {
                            name: file.name,
                            mimeType: file.type || 'text/plain',
                            kind: 'text',
                            data: text,
                        }];
            }
        });
    });
}
function evidenceToParts(items, pastedText) {
    var parts = [];
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if (item.kind === 'text') {
            parts.push({ text: "\n===== EVIDENCE FILE: ".concat(item.name, " (").concat(item.mimeType, ") =====\n").concat(item.data, "\n===== END ").concat(item.name, " =====") });
        }
        else {
            parts.push({ text: "\n===== EVIDENCE IMAGE/DOCUMENT: ".concat(item.name, " =====") });
            parts.push({ inlineData: { mimeType: item.mimeType, data: item.data } });
        }
    }
    if (pastedText.trim()) {
        parts.push({ text: "\n===== PASTED RAW FINDING =====\n".concat(pastedText.trim().slice(0, MAX_TEXT_BYTES), "\n===== END PASTED FINDING =====") });
    }
    return parts;
}

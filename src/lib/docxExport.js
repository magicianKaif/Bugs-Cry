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
exports.exportReportDocx = exportReportDocx;
var docx_1 = require("docx");
var file_saver_1 = require("file-saver");
var ACCENT = 'F97316';
var TEAL = '14B8A6';
var DARK = '0F1B2D';
var SEV_COLORS = {
    Critical: 'EF4444',
    High: 'F59E0B',
    Medium: 'EAB308',
    Low: '22C55E',
    Informational: '3B82F6',
};
function h1(text) {
    return new docx_1.Paragraph({
        heading: docx_1.HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 160 },
        children: [new docx_1.TextRun({ text: text, color: DARK, bold: true, size: 36 })],
    });
}
function h2(text) {
    return new docx_1.Paragraph({
        heading: docx_1.HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 120 },
        children: [new docx_1.TextRun({ text: text, color: DARK, bold: true, size: 28 })],
    });
}
function body(text) {
    return new docx_1.Paragraph({ spacing: { after: 120 }, children: [new docx_1.TextRun({ text: text, size: 22 })] });
}
function bullet(text) {
    return new docx_1.Paragraph({
        bullet: { level: 0 },
        spacing: { after: 80 },
        children: [new docx_1.TextRun({ text: text, size: 22 })],
    });
}
function labelValue(label, value, valueColor) {
    return new docx_1.Paragraph({
        spacing: { after: 60 },
        children: [
            new docx_1.TextRun({ text: "".concat(label, ": "), bold: true, size: 22, color: DARK }),
            new docx_1.TextRun({ text: value, size: 22, color: valueColor !== null && valueColor !== void 0 ? valueColor : '222222' }),
        ],
    });
}
function findingBlock(f, index) {
    var _a;
    var sevColor = (_a = SEV_COLORS[f.severity]) !== null && _a !== void 0 ? _a : DARK;
    var verdictLabel = f.verdict.replace(/_/g, ' ').toUpperCase();
    var rows = __spreadArray([
        new docx_1.Paragraph({
            heading: docx_1.HeadingLevel.HEADING_3,
            spacing: { before: 320, after: 100 },
            children: [
                new docx_1.TextRun({ text: "".concat(index + 1, ". ").concat(f.title), bold: true, size: 26, color: DARK }),
            ],
        }),
        labelValue('Severity', f.severity, sevColor),
        labelValue('Verdict', verdictLabel, f.verdict === 'false_positive' ? '3B82F6' : undefined),
        labelValue('Confidence', "".concat(f.confidence, "/100")),
        labelValue('CWE', f.cwe),
        labelValue('OWASP', f.owasp),
        labelValue('CVSS', f.cvssVector),
        h2('Evidence'),
        body(f.evidence),
        h2('Business impact'),
        body(f.businessImpact),
        h2('Executive note'),
        body(f.executiveNote),
        h2('Remediation')
    ], f.remediation.map(function (s) { return bullet(s); }), true);
    if (f.references.length) {
        rows.push.apply(rows, __spreadArray([h2('References')], f.references.map(function (r) { return bullet(r); }), false));
    }
    return rows;
}
function exportReportDocx(report) {
    return __awaiter(this, void 0, void 0, function () {
        var statsTable, doc, blob, safe;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    statsTable = new docx_1.Table({
                        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
                        borders: {
                            top: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                            bottom: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                            left: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                            right: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                            insideHorizontal: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                            insideVertical: { style: docx_1.BorderStyle.SINGLE, size: 4, color: 'CCCCCC' },
                        },
                        rows: [
                            new docx_1.TableRow({
                                children: ['Total findings', 'True positives', 'False positives', 'Informational'].map(function (t) {
                                    return new docx_1.TableCell({
                                        children: [
                                            new docx_1.Paragraph({
                                                alignment: docx_1.AlignmentType.CENTER,
                                                children: [new docx_1.TextRun({ text: t, bold: true, size: 20, color: DARK })],
                                            }),
                                        ],
                                    });
                                }),
                            }),
                            new docx_1.TableRow({
                                children: [
                                    report.statistics.total,
                                    report.statistics.truePositives,
                                    report.statistics.falsePositives,
                                    report.statistics.informational,
                                ].map(function (n) {
                                    return new docx_1.TableCell({
                                        children: [
                                            new docx_1.Paragraph({
                                                alignment: docx_1.AlignmentType.CENTER,
                                                children: [new docx_1.TextRun({ text: String(n), size: 22 })],
                                            }),
                                        ],
                                    });
                                }),
                            }),
                        ],
                    });
                    doc = new docx_1.Document({
                        creator: 'BugsCry — Evidence-Grounded Multi-Agent Pipeline',
                        title: report.reportTitle,
                        sections: [
                            {
                                children: __spreadArray(__spreadArray(__spreadArray(__spreadArray([
                                    new docx_1.Paragraph({
                                        alignment: docx_1.AlignmentType.CENTER,
                                        spacing: { after: 120 },
                                        children: [
                                            new docx_1.TextRun({ text: report.reportTitle, bold: true, size: 44, color: DARK }),
                                        ],
                                    }),
                                    new docx_1.Paragraph({
                                        alignment: docx_1.AlignmentType.CENTER,
                                        spacing: { after: 60 },
                                        children: [
                                            new docx_1.TextRun({
                                                text: "Generated ".concat(new Date().toLocaleString(), " \u00B7 BugsCry evidence-grounded pipeline"),
                                                size: 20,
                                                color: '666666',
                                            }),
                                        ],
                                    }),
                                    new docx_1.Paragraph({
                                        alignment: docx_1.AlignmentType.CENTER,
                                        spacing: { after: 360 },
                                        children: [
                                            new docx_1.TextRun({
                                                text: "Overall risk rating: ".concat(report.overallRiskRating),
                                                bold: true,
                                                size: 26,
                                                color: (_a = SEV_COLORS[report.overallRiskRating]) !== null && _a !== void 0 ? _a : ACCENT,
                                            }),
                                        ],
                                    }),
                                    h1('1. Executive summary'),
                                    body(report.executiveSummary),
                                    h1('2. Statistics'),
                                    statsTable,
                                    h1('3. Scope'),
                                    body(report.scope),
                                    h1('4. Methodology'),
                                    body(report.methodology),
                                    h1('5. Findings')
                                ], report.findings.flatMap(function (f, i) { return findingBlock(f, i); }), true), [
                                    h1('6. Recommendations')
                                ], false), report.recommendations.map(function (r) { return bullet(r); }), true), (report.reviewFlags.length
                                    ? __spreadArray([
                                        h1('7. Items flagged for human review')
                                    ], report.reviewFlags.map(function (r) {
                                        return new docx_1.Paragraph({
                                            bullet: { level: 0 },
                                            spacing: { after: 80 },
                                            children: [new docx_1.TextRun({ text: r, size: 22, color: TEAL })],
                                        });
                                    }), true) : []), true),
                            },
                        ],
                    });
                    return [4 /*yield*/, docx_1.Packer.toBlob(doc)];
                case 1:
                    blob = _b.sent();
                    safe = report.reportTitle.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
                    (0, file_saver_1.saveAs)(blob, "".concat(safe || 'security-report', ".docx"));
                    return [2 /*return*/];
            }
        });
    });
}

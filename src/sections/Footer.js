"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Footer;
function Footer() {
    return (<footer className="border-t border-ink-600/60 bg-ink-900">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6">
        <p className="text-sm text-mist-400">
          <span className="font-semibold text-mist-0">BugsCry</span> — evidence-grounded
          multi-agent vulnerability analysis. Based on the framework by Kaif Shaikh &amp; Magician
          Slime.
        </p>
        <p className="font-mono text-xs text-mist-500">
          Gemini ×3 · CWE · OWASP · CVSS v3.1 · DOCX
        </p>
      </div>
    </footer>);
}

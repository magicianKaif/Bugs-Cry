"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Header;
function Header() {
    var links = [
        { href: '#why', label: 'Why us' },
        { href: '#pipeline', label: 'Pipeline' },
        { href: '#analyze', label: 'Analyze' },
        { href: '#report', label: 'Report' },
    ];
    return (<header className="sticky top-0 z-50 border-b border-ink-600/70 bg-ink-900/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2l8 3.5v5.2c0 5-3.4 9.6-8 11.3-4.6-1.7-8-6.3-8-11.3V5.5L12 2z" stroke="#F97316" strokeWidth="1.8" fill="rgba(249,115,22,0.12)"/>
            <path d="M8.5 12l2.4 2.4L15.5 9.6" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-lg font-bold tracking-tight text-mist-0">
            Bugs<span className="text-brand-500">Cry</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {links.map(function (l) { return (<a key={l.href} href={l.href} className="text-sm font-medium text-mist-400 transition-colors hover:text-mist-0">
              {l.label}
            </a>); })}
        </nav>
        <a href="#analyze" className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-600">
          Analyze findings
        </a>
      </div>
    </header>);
}

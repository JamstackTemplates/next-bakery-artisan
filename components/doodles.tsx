import type { ReactNode } from 'react';

// Small decorative drawings shared across pages: wheat-stalk dividers, the "Baked today" stamp and
// handwritten price tags on string. Coloured by theme tokens; decorative unless they carry text.

/** A wheat sprig between two dashed rules, used between sections. */
export function WheatDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`wheat-divider wrap ${className}`} aria-hidden="true">
      <svg width="88" height="28" viewBox="0 0 88 28" focusable="false">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M44 24V6M44 24C34 20 20 18 6 20M44 24c10-4 24-6 38-4" />
        </g>
        <g fill="currentColor">
          <ellipse cx="44" cy="4" rx="2.4" ry="4.2" />
          {[8, 13, 18].map(y => (
            <g key={y}>
              <ellipse cx="40.5" cy={y} rx="2.2" ry="4" transform={`rotate(-35 40.5 ${y})`} />
              <ellipse cx="47.5" cy={y} rx="2.2" ry="4" transform={`rotate(35 47.5 ${y})`} />
            </g>
          ))}
          {[14, 22, 30].map(x => <ellipse key={x} cx={x} cy={19.5 - (x - 14) * 0.05} rx="3.6" ry="1.8" transform={`rotate(-8 ${x} 19)`} />)}
          {[58, 66, 74].map(x => <ellipse key={x} cx={x} cy={19.5 - (74 - x) * 0.05} rx="3.6" ry="1.8" transform={`rotate(8 ${x} 19)`} />)}
        </g>
      </svg>
    </div>
  );
}

/** Round rubber stamp reading "Baked today". */
export function BakedTodayStamp({ name, className = '' }: { name: string; className?: string }) {
  const ring = `${name} · fresh from the oven ·`;
  return (
    <svg className={`stamp ${className}`} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      <defs>
        <path id="stamp-ring" d="M80 80m-56 0a56 56 0 1 1 112 0a56 56 0 1 1-112 0" />
      </defs>
      <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="80" cy="80" r="44" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 4" />
      <text fontSize="11.5" fill="currentColor"><textPath href="#stamp-ring" textLength="345">{ring}</textPath></text>
      <text x="80" y="76" textAnchor="middle" fontSize="13" fill="currentColor">Baked</text>
      <text x="80" y="94" textAnchor="middle" fontSize="13" fill="currentColor">today</text>
      <path d="M68 104h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Handwritten price tag hanging from a piece of string. */
export function PriceTag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block pl-3 ${className}`}>
      <svg className="price-tag__string -top-3 -left-1 h-7 w-6" viewBox="0 0 24 28" aria-hidden="true" focusable="false">
        <path d="M22 26C12 22 6 14 3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="price-tag">{children}</span>
    </span>
  );
}

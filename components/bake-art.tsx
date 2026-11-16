import type { CSSProperties, ReactNode } from 'react';
import type { Art } from '../content/bakes';

// Little drawings for bakes, on a 64×64 grid.
// `color` tints the crust, filling or fruit; outlines, crumb and pastry come from theme tokens
// in app/tailwind.input.css, so the same drawing changes with light and dark mode.

const line = { stroke: 'var(--art-line)', strokeWidth: 2, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
const shine = 'var(--art-shine)';
const shade = 'var(--art-shade)';
const flour = 'var(--art-flour)';

const steam = (
  <g className="art-steam" fill="none" stroke="var(--steam)" strokeWidth="2" strokeLinecap="round">
    <path d="M26 13c-3-3 3-5 0-9" />
    <path d="M36 15c-3-3 3-5 0-9" />
  </g>
);

/** Flour dust scattered on a crust. */
const dust = (points: [number, number, number][]) => (
  <g fill={flour}>{points.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}</g>
);

const drawings: Record<Art, (color: string) => ReactNode> = {
  boule: color => (
    <>
      <ellipse cx="32" cy="52" rx="23" ry="3.5" fill={shade} />
      <path d="M7 45c0-15 11-27 25-27s25 12 25 27c0 4-3 6-7 6H14c-4 0-7-2-7-6z" fill={color} {...line} />
      <path d="M15 36c8-8 25-9 34-3-9 2-25 1-34 3z" fill="var(--art-crumb)" />
      <path d="M15 36c8-8 25-9 34-3" fill="none" stroke={shade} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19 44c6-3 18-3 25-1" fill="none" stroke="var(--art-crumb)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M13 32c2-5 6-8 10-10" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
      {dust([[24, 25, 1.4], [30, 23, 1], [38, 24, 1.3], [44, 28, 1], [34, 27, 0.8], [27, 29, 0.9]])}
      {steam}
    </>
  ),
  baguette: color => (
    <>
      <ellipse cx="32" cy="54" rx="24" ry="3" fill={shade} />
      <g transform="rotate(-32 32 34)">
        <rect x="2" y="27" width="60" height="15" rx="7.5" fill={color} {...line} />
        {[12, 23, 34, 45].map(x => (
          <path key={x} d={`M${x} 31.5c3 1.5 6 3 9 3`} fill="none" stroke="var(--art-crumb)" strokeWidth="3" strokeLinecap="round" />
        ))}
        <path d="M8 31c4-2 10-2.5 16-2.5" fill="none" stroke={shine} strokeWidth="2" strokeLinecap="round" />
        <path d="M6 39h52" stroke={shade} strokeWidth="2" strokeLinecap="round" />
      </g>
      {dust([[20, 40, 1], [34, 30, 1.2], [44, 22, 0.9]])}
    </>
  ),
  'tin-loaf': color => (
    <>
      <ellipse cx="32" cy="53" rx="23" ry="3" fill={shade} />
      <path d="M11 52V33c0-9 9-15 21-15s21 6 21 15v19z" fill={color} {...line} />
      <path d="M11 41h42v11H11z" fill={shade} />
      <path d="M21 25c5 3 17 3 22 0" fill="none" stroke="var(--art-crumb)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 31c1-4 4-7 8-8" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
      <g fill="var(--art-crumb)" opacity=".85">
        {[[20, 32], [27, 30], [35, 31], [42, 33], [24, 36], [31, 35], [39, 37], [46, 37]].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.6" ry=".9" transform={`rotate(${(x * 7) % 50 - 25} ${x} ${y})`} />
        ))}
      </g>
    </>
  ),
  focaccia: color => (
    <>
      <ellipse cx="32" cy="52" rx="26" ry="3.5" fill={shade} />
      <rect x="6" y="20" width="52" height="30" rx="6" fill={color} {...line} />
      <path d="M6 43h52v1a6 6 0 0 1-6 6H12a6 6 0 0 1-6-6z" fill={shade} />
      <g fill={shade}>
        {[[14, 27], [26, 26], [38, 27], [50, 26], [20, 35], [32, 34], [44, 35]].map(([x, y]) => <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="2.4" ry="1.8" />)}
      </g>
      <g fill="none" stroke="var(--art-leaf)" strokeWidth="1.8" strokeLinecap="round">
        <path d="M17 31l4-5M19 30l3 1M18 28l3 0" />
        <path d="M40 31l5-4M42 30l2 1.5M43 28l2-.5" />
        <path d="M29 40l4-4M31 39l2.5.5" />
      </g>
      <g fill="var(--art-cream)">
        <rect x="23" y="30" width="2" height="2" transform="rotate(20 24 31)" />
        <rect x="35" y="38" width="2" height="2" transform="rotate(-15 36 39)" />
        <rect x="47" y="31" width="1.8" height="1.8" />
        <rect x="12" y="38" width="1.8" height="1.8" transform="rotate(30 13 39)" />
      </g>
    </>
  ),
  croissant: color => (
    <>
      <ellipse cx="32" cy="50" rx="24" ry="3.5" fill={shade} />
      <path d="M6 40c1-8 7-14 13-15l3 19c-6 3-13 1-16-4z" fill={color} {...line} />
      <path d="M58 40c-1-8-7-14-13-15l-3 19c6 3 13 1 16-4z" fill={color} {...line} />
      <path d="M17 25c4-4 9-6 15-6s11 2 15 6l-4 21c-3 2-7 3-11 3s-8-1-11-3z" fill={color} {...line} />
      <path d="M24 22c-1 8-1 16 1 25M40 22c1 8 1 16-1 25" fill="none" stroke={shade} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 27c3-3 6-4 10-4.5" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 37c1-3 3-6 6-8M48 30c3 1 5 4 6 7" fill="none" stroke={shine} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  'pain-au-chocolat': color => (
    <>
      <ellipse cx="32" cy="50" rx="24" ry="3.5" fill={shade} />
      <rect x="6" y="31" width="5" height="5" rx="1.2" fill="var(--art-choc)" />
      <rect x="53" y="31" width="5" height="5" rx="1.2" fill="var(--art-choc)" />
      <rect x="9" y="21" width="46" height="26" rx="11" fill={color} {...line} />
      <path d="M13 29c12-3 26-3 38 0M12 36c13-2 27-2 40 0M13 42c12 2 26 2 38 0" fill="none" stroke={shade} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 26c5-2 11-2.5 16-2.5" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  bun: color => (
    <>
      <ellipse cx="32" cy="52" rx="22" ry="3.5" fill={shade} />
      <path d="M11 37c0-12 9-21 21-21s21 9 21 21c0 9-9 14-21 14s-21-5-21-14z" fill={color} {...line} />
      <path d="M32 33c-2 0-2.5-3 0-3 4 0 4.5 6 0 6-6 0-6-10 1-10 8 0 9 13-1 13-10 0-11-15 0-17" fill="none" stroke="var(--bun-swirl)" strokeWidth="2.4" strokeLinecap="round" opacity=".75" />
      <path d="M16 31c2-5 6-9 11-10" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
      <g fill="var(--art-cream)">
        {[[22, 27, 1.6], [40, 25, 1.4], [45, 35, 1.7], [19, 40, 1.4], [36, 44, 1.5], [27, 38, 1.1], [43, 42, 1.2]].map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
      </g>
    </>
  ),
  cookie: color => (
    <>
      <ellipse cx="32" cy="53" rx="20" ry="3" fill={shade} />
      <path d="M32 13c6 0 9 2 13 5s7 7 7 13-1 10-5 14-9 6-15 6-10-1-14-5-6-9-6-15 2-10 6-13 8-5 14-5z" fill={color} {...line} />
      <g fill="var(--art-choc)">
        <path d="M24 24l5 1-1 4-5-1z" /><path d="M38 21l4 2-2 4-4-2z" /><path d="M41 35l5 1-1 5-5-1z" />
        <path d="M26 39l4-1 1 4-4 1z" /><path d="M33 30l3 1-1 3-3-1z" />
      </g>
      <g fill="var(--art-cream)"><rect x="30" y="20" width="2" height="2" /><rect x="20" y="33" width="1.8" height="1.8" /><rect x="37" y="44" width="2" height="2" /></g>
      <path d="M17 27c1-5 4-9 8-11" fill="none" stroke={shine} strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  tart: color => (
    <>
      <ellipse cx="32" cy="52" rx="25" ry="3.5" fill={shade} />
      <path d="M7 33v6c0 6 11 11 25 11s25-5 25-11v-6z" fill="var(--art-pastry)" {...line} />
      <path d="M12 41v5M18 43v5M25 44v5M32 45v5M39 44v5M46 43v5M52 41v5" stroke={shade} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="32" cy="33" rx="25" ry="11" fill="var(--art-pastry)" {...line} />
      <ellipse cx="32" cy="33" rx="20" ry="7.5" fill="var(--art-cream)" />
      <ellipse cx="32" cy="33.5" rx="18" ry="6.5" fill={color} />
      <g fill={shine}><circle cx="24" cy="31" r="2.2" /><circle cx="33" cy="29.5" r="1.6" /><circle cx="40" cy="33" r="2" /><circle cx="29" cy="36" r="1.3" /></g>
      <g fill="none" stroke={shade} strokeWidth="1.4"><circle cx="24" cy="32" r="3.2" /><circle cx="35" cy="31" r="3" /><circle cx="42" cy="34.5" r="2.8" /><circle cx="30" cy="36.5" r="2.6" /></g>
    </>
  ),
  'cake-slice': color => (
    <>
      <ellipse cx="34" cy="53" rx="24" ry="3" fill={shade} />
      <path d="M7 36L55 30v18L7 53z" fill={color} {...line} />
      <path d="M7 43.5L55 39" stroke="var(--art-cream)" strokeWidth="3.2" />
      <path d="M7 36L40 21l15 9z" fill="var(--art-cream)" {...line} />
      <path d="M44 23c1 4 3 6 6 9M30 27c0 3 1 5 3 7" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" opacity=".55" />
      <path d="M14 47l34-4" stroke={shine} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="44" cy="25" r="2.6" fill={color} {...line} strokeWidth="1.4" />
    </>
  ),
  sandwich: color => (
    <>
      <ellipse cx="32" cy="54" rx="25" ry="3" fill={shade} />
      <path d="M8 44h48v4a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" fill="var(--art-crumb)" {...line} />
      <path d="M7 41c4-3 7 2 11-1s7 2 11-1 7 2 11-1 7 2 11-1 6 1 6 1v4H7z" fill="var(--art-leaf)" />
      <path d="M9 36h46l-2 6H11z" fill={color} {...line} strokeWidth="1.6" />
      <path d="M10 34h44v3H10z" fill="var(--art-cream)" />
      <path d="M8 34c0-11 11-18 24-18s24 7 24 18z" fill="var(--art-crumb)" stroke="var(--art-crust)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8 34c0-11 11-18 24-18s24 7 24 18z" fill="none" {...line} />
      <g fill={shade}><circle cx="22" cy="27" r="1.3" /><circle cx="31" cy="24" r="1" /><circle cx="40" cy="28" r="1.4" /><circle cx="27" cy="30" r=".9" /></g>
      <path d="M15 27c2-4 6-6 10-7" fill="none" stroke={shine} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

/** Decorative drawing for a bake, on a soft disc tinted by its colour. */
export function BakeArt({ art, color, size = 64, className = '' }: { art: Art; color: string; size?: number; className?: string }) {
  return (
    <span className={`bake-art ${className}`} style={{ '--art-tint': color, width: size, height: size } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size} focusable="false">{drawings[art](color)}</svg>
    </span>
  );
}

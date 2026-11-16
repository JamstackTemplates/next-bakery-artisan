import type { Cake } from '../content/cakes';

// Celebration cakes drawn from content: sponge, filling, frosting and decoration colours, the style
// (frosted, naked or drip) and the number of tiers. New cakes need no image files.
// Outlines and the cake stand come from theme tokens, so the drawing follows light and dark mode.

const line = { stroke: 'var(--art-line)', strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

type Tier = { cx: number; bottom: number; w: number; h: number };

const TIERS: Record<Cake['tiers'], { w: number; h: number }[]> = {
  1: [{ w: 128, h: 70 }],
  2: [{ w: 128, h: 54 }, { w: 90, h: 46 }],
  3: [{ w: 134, h: 44 }, { w: 100, h: 38 }, { w: 68, h: 34 }],
};

const ry = (w: number) => w * 0.12;

/** Side of a tier between two heights, following the curved front edge. */
function band({ cx, w }: Tier, y1: number, y2: number): string {
  const rx = w / 2;
  const r = ry(w);
  return `M${cx - rx} ${y1}V${y2}A${rx} ${r} 0 0 0 ${cx + rx} ${y2}V${y1}A${rx} ${r} 0 0 1 ${cx - rx} ${y1}Z`;
}

/** Ganache drip hanging from the top edge. */
function drip({ cx, bottom, w, h }: Tier): string {
  const rx = w / 2;
  const r = ry(w);
  const top = bottom - h;
  const edge = (x: number) => top + r * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));
  const lengths = [10, 22, 8, 30, 14, 9, 26, 12, 18, 7];
  const steps = lengths.length;
  let path = `M${cx - rx} ${top}`;
  for (let i = 0; i < steps; i++) {
    const x0 = cx - rx + (w * i) / steps;
    const x1 = cx - rx + (w * (i + 1)) / steps;
    const mid = (x0 + x1) / 2;
    const len = Math.min(lengths[i], h * 0.6);
    path += `L${(x0 + mid) / 2} ${edge((x0 + mid) / 2) + 4}`;
    path += `L${mid - 3} ${edge(mid) + len}a3 3 0 0 0 6 0`;
    path += `L${(mid + x1) / 2} ${edge((mid + x1) / 2) + 4}`;
  }
  path += `L${cx + rx} ${top}A${rx} ${r} 0 0 0 ${cx - rx} ${top}Z`;
  return path;
}

function Layers({ tier, colors, count }: { tier: Tier; colors: Cake['colors']; count: number }) {
  const top = tier.bottom - tier.h;
  const step = tier.h / count;
  return (
    <>
      <path d={band(tier, top, tier.bottom)} fill={colors.sponge} />
      {Array.from({ length: count - 1 }, (_, index) => {
        const y = top + step * (index + 1);
        return <path key={index} d={band(tier, y - 2.5, y + 2.5)} fill={colors.filling} />;
      })}
    </>
  );
}

function TierDrawing({ tier, cake, clipId, showCut }: { tier: Tier; cake: Cake; clipId: string; showCut: boolean }) {
  const { colors, style } = cake;
  const rx = tier.w / 2;
  const top = tier.bottom - tier.h;
  const layers = Math.max(2, Math.round(tier.h / 22));
  const cutX = tier.cx + rx * 0.28;
  return (
    <g>
      {style === 'naked' ? (
        <>
          <Layers tier={tier} colors={colors} count={layers} />
          {/* A thin scrape of buttercream, with the sponge showing through. */}
          <path d={band(tier, top, tier.bottom)} fill={colors.frosting} opacity=".55" />
          <path d={band(tier, tier.bottom - 5, tier.bottom)} fill={colors.frosting} opacity=".6" />
        </>
      ) : (
        <>
          <path d={band(tier, top, tier.bottom)} fill={colors.frosting} />
          {showCut ? (
            <g clipPath={`url(#${clipId})`}>
              <Layers tier={tier} colors={colors} count={layers + 1} />
              <path d={`M${cutX} ${top}V${tier.bottom + ry(tier.w)}`} stroke={colors.frosting} strokeWidth="5" />
            </g>
          ) : null}
        </>
      )}
      <path d={band(tier, top, tier.bottom)} fill="none" {...line} />
      {style === 'drip' ? <path d={drip(tier)} fill={colors.sponge} {...line} strokeWidth="1.8" /> : null}
      <ellipse cx={tier.cx} cy={top} rx={rx} ry={ry(tier.w)} fill={style === 'drip' ? colors.sponge : colors.frosting} {...line} />
      {style === 'frosted' ? (
        <g fill={colors.frosting} {...line} strokeWidth="1.4">
          {Array.from({ length: 9 }, (_, index) => {
            const t = (index + 0.5) / 9;
            const x = tier.cx - rx + t * tier.w;
            const y = tier.bottom + ry(tier.w) * Math.sqrt(1 - (2 * t - 1) ** 2) - 1;
            return <circle key={index} cx={x} cy={y} r="4.2" />;
          })}
        </g>
      ) : null}
      <path d={`M${tier.cx - rx + 8} ${top + 10}V${tier.bottom - 4}`} stroke="var(--art-shine)" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** Berries, leaves or flowers on the top tier. */
function Decoration({ tier, cake }: { tier: Tier; cake: Cake }) {
  const top = tier.bottom - tier.h;
  const rx = tier.w / 2;
  const color = cake.colors.decoration;
  const flowers = cake.tiers > 1;
  const spots = [-0.55, -0.25, 0.05, 0.32, 0.58].map((t, index) => ({ x: tier.cx + t * rx, y: top - 4 + (index % 2) * 5 }));
  return (
    <g>
      <g fill="var(--art-leaf)">
        {spots.slice(0, 4).map(({ x, y }, index) => (
          <ellipse key={index} cx={x + 7} cy={y + 2} rx="6" ry="2.6" transform={`rotate(${index % 2 ? 25 : -25} ${x + 7} ${y + 2})`} />
        ))}
      </g>
      {spots.map(({ x, y }, index) => flowers ? (
        <g key={index}>
          {[0, 72, 144, 216, 288].map(angle => (
            <ellipse key={angle} cx={x} cy={y - 4.5} rx="3.2" ry="4.8" fill={color} transform={`rotate(${angle} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="2.4" fill="var(--wheat)" />
        </g>
      ) : (
        <g key={index}>
          <circle cx={x} cy={y} r="5.5" fill={color} {...line} strokeWidth="1.6" />
          <circle cx={x - 1.8} cy={y - 1.8} r="1.4" fill="var(--art-shine)" />
        </g>
      ))}
    </g>
  );
}

/** Decorative drawing of a celebration cake on a stand. Pass `idPrefix` if the same cake is drawn twice on one page. */
export function CakeArt({ cake, className = '', idPrefix = 'cake' }: { cake: Cake; className?: string; idPrefix?: string }) {
  const clipId = `${idPrefix}-${cake.id}-cut`;
  const cx = 100;
  let bottom = 152;
  const tiers: Tier[] = TIERS[cake.tiers].map(size => {
    const tier = { cx, bottom, ...size };
    bottom -= size.h;
    return tier;
  });
  const base = tiers[0];
  // Crop the empty sky above short cakes, leaving room for the decorations.
  const top = Math.floor(bottom - ry(tiers.at(-1)!.w) - 18);
  return (
    <svg className={`h-auto w-full overflow-visible ${className}`} viewBox={`0 ${top} 200 ${186 - top}`} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <rect x={base.cx + base.w / 2 * 0.28} y={0} width={base.w} height={200} />
        </clipPath>
      </defs>
      {/* Stand */}
      <ellipse cx="100" cy="182" rx="40" ry="4" fill="var(--art-shade)" />
      <path d="M88 162h24l6 16H82z" fill="var(--cake-stand-shade)" {...line} />
      <ellipse cx="100" cy="160" rx="88" ry="12" fill="var(--cake-stand)" {...line} />
      <path d="M22 160a78 8 0 0 0 156 0" fill="none" stroke="var(--cake-stand-shade)" strokeWidth="2" />
      {tiers.map((tier, index) => (
        <TierDrawing key={index} tier={tier} cake={cake} clipId={clipId} showCut={index === 0} />
      ))}
      <Decoration tier={tiers.at(-1)!} cake={cake} />
    </svg>
  );
}

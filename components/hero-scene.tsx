// The home page illustration: a bread board with a scored sourdough boule, a baguette, croissants and a
// cinnamon bun, dusted with flour beside a few wheat stalks. Pure SVG coloured by theme tokens, so the
// same drawing sits in soft morning light in light mode and before a glowing wood-fired oven in dark mode.
// Decorative only — the page text carries all information.

const line = { stroke: 'var(--art-line)', strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;

const OVEN = 'M58 352V196C58 100 160 44 280 44S502 100 502 196V352Z';
const MOUTH = 'M168 352V236C168 178 218 140 280 140S392 178 392 236V352Z';

/** A wheat stalk from (x, y) leaning by `lean`, with ears along its top. */
function WheatStalk({ x, y, length, lean }: { x: number; y: number; length: number; lean: number }) {
  const tipX = x + lean;
  const tipY = y - length;
  const ears = Array.from({ length: 6 }, (_, index) => {
    const t = 1 - index * 0.075;
    return { cx: x + lean * t, cy: y - length * t };
  });
  const angle = (Math.atan2(lean, length) * 180) / Math.PI;
  return (
    <g>
      <path d={`M${x} ${y}Q${x + lean * 0.4} ${y - length * 0.5} ${tipX} ${tipY}`} fill="none" stroke="var(--wheat-stalk-dark)" strokeWidth="3" strokeLinecap="round" />
      {ears.map(({ cx, cy }, index) => (
        <g key={index} transform={`rotate(${angle} ${cx} ${cy})`}>
          <ellipse cx={cx - 6} cy={cy + 4} rx="5" ry="10" transform={`rotate(-28 ${cx - 6} ${cy + 4})`} fill="var(--wheat-stalk)" stroke="var(--wheat-stalk-dark)" strokeWidth="1.5" />
          <ellipse cx={cx + 6} cy={cy + 4} rx="5" ry="10" transform={`rotate(28 ${cx + 6} ${cy + 4})`} fill="var(--wheat-stalk)" stroke="var(--wheat-stalk-dark)" strokeWidth="1.5" />
        </g>
      ))}
      <ellipse cx={tipX} cy={tipY - 4} rx="4.5" ry="10" transform={`rotate(${angle} ${tipX} ${tipY - 4})`} fill="var(--wheat-stalk)" stroke="var(--wheat-stalk-dark)" strokeWidth="1.5" />
      <path d={`M${tipX} ${tipY - 10}l${lean * 0.08} -26`} stroke="var(--wheat-stalk-dark)" strokeWidth="1.2" />
    </g>
  );
}

/** A croissant drawn on the 64×64 grid of the bake drawings, placed and scaled. */
function Croissant({ transform }: { transform: string }) {
  return (
    <g transform={transform}>
      <g fill="var(--croissant)" stroke="var(--art-line)" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M6 40c1-8 7-14 13-15l3 19c-6 3-13 1-16-4z" />
        <path d="M58 40c-1-8-7-14-13-15l-3 19c6 3 13 1 16-4z" />
        <path d="M17 25c4-4 9-6 15-6s11 2 15 6l-4 21c-3 2-7 3-11 3s-8-1-11-3z" />
      </g>
      <path d="M24 22c-1 8-1 16 1 25M40 22c1 8 1 16-1 25" fill="none" stroke="var(--croissant-dark)" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 27c3-3 6-4 10-4.5M10 37c1-3 3-6 6-8" fill="none" stroke="var(--art-shine)" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

const flourOnBoule: [number, number, number][] = [
  [186, 262, 3], [204, 256, 2.2], [226, 254, 3.4], [246, 258, 2.4], [262, 266, 3], [214, 266, 2], [238, 268, 2.6],
  [196, 276, 1.8], [276, 280, 2.2], [172, 276, 2], [252, 276, 1.6], [224, 280, 1.4], [160, 296, 1.6], [290, 296, 1.8],
];

const drift: [number, number, number][] = [
  [120, 120, 2.4], [168, 80, 1.6], [330, 96, 2], [398, 140, 1.4], [446, 92, 2.2], [262, 70, 1.4], [92, 200, 1.6], [480, 210, 1.8], [360, 196, 1.2],
];

export function HeroScene() {
  return (
    <svg className="scene" viewBox="0 0 560 460" role="presentation" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hero-fire" cx="50%" cy="78%" r="70%">
          <stop offset="0" style={{ stopColor: 'var(--oven-fire-2)' }} />
          <stop offset=".35" style={{ stopColor: 'var(--oven-fire)' }} />
          <stop offset="1" style={{ stopColor: 'var(--oven-mouth)' }} />
        </radialGradient>
        <radialGradient id="hero-light" cx="50%" cy="40%" r="60%">
          <stop offset="0" style={{ stopColor: '#ffffff', stopOpacity: 0.55 }} />
          <stop offset="1" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
        </radialGradient>
        <clipPath id="hero-oven"><path d={OVEN} /></clipPath>
        <clipPath id="hero-mouth"><path d={MOUTH} /></clipPath>
      </defs>

      {/* Day: soft morning light through an arched window */}
      <g className="scene__day">
        <circle cx="280" cy="214" r="208" fill="var(--halo)" />
        <path d="M160 312V160C160 100 214 62 280 62S400 100 400 160V312Z" fill="var(--window)" />
        <path d="M280 64V312M160 196H400M160 260H400" stroke="var(--halo)" strokeWidth="7" />
        <circle cx="280" cy="170" r="150" fill="url(#hero-light)" />
      </g>

      {/* Night: the arched mouth of a wood-fired oven, glowing */}
      <g className="scene__night">
        <path d={OVEN} fill="var(--oven-brick)" />
        <g clipPath="url(#hero-oven)" stroke="var(--oven-mortar)" strokeWidth="2.5" opacity=".7">
          {Array.from({ length: 12 }, (_, row) => {
            const y = 70 + row * 26;
            return (
              <g key={row}>
                <path d={`M40 ${y}H520`} />
                {Array.from({ length: 10 }, (_, col) => {
                  const x = 60 + col * 52 + (row % 2) * 26;
                  return <path key={col} d={`M${x} ${y}V${y + 26}`} />;
                })}
              </g>
            );
          })}
        </g>
        <path d={MOUTH} fill="var(--oven-mouth)" />
        <path d="M152 352V236C152 168 210 124 280 124S408 168 408 236V352" fill="none" stroke="var(--oven-brick-2)" strokeWidth="22" strokeDasharray="16 5" />
        <g clipPath="url(#hero-mouth)">
          <g className="scene__fire">
            <rect x="160" y="130" width="240" height="230" fill="url(#hero-fire)" />
            <path d="M200 352c-6-30 18-38 12-66 22 18 30 40 22 66zM262 352c-10-40 22-58 14-96 28 26 38 62 26 96zM322 352c-4-26 14-36 10-58 18 16 24 36 16 58z" fill="var(--oven-fire-2)" opacity=".75" />
          </g>
          <g className="scene__embers" fill="var(--oven-fire-2)">
            <circle cx="230" cy="300" r="2.4" /><circle cx="268" cy="290" r="1.8" /><circle cx="300" cy="306" r="2.2" /><circle cx="334" cy="296" r="1.6" /><circle cx="250" cy="316" r="1.4" />
          </g>
        </g>
      </g>

      {/* The board's shadow */}
      <ellipse cx="290" cy="424" rx="250" ry="18" fill="var(--board-shadow)" />

      {/* Bread board with a handle */}
      <rect x="460" y="350" width="86" height="32" rx="16" fill="var(--board-edge)" />
      <rect x="460" y="340" width="86" height="32" rx="16" fill="var(--board)" {...line} />
      <circle cx="526" cy="356" r="6.5" fill="var(--board-edge)" />
      <rect x="44" y="330" width="436" height="84" rx="38" fill="var(--board-edge)" {...line} />
      <rect x="44" y="316" width="436" height="84" rx="38" fill="var(--board)" {...line} />
      <path d="M80 344C170 334 270 350 450 338M96 372C190 362 300 380 440 366M140 356c40-4 70 2 100-2" fill="none" stroke="var(--board-grain)" strokeWidth="2.5" strokeLinecap="round" />
      <g fill="var(--flour)" opacity=".85">
        <ellipse cx="130" cy="384" rx="34" ry="6" opacity=".55" />
        <ellipse cx="350" cy="392" rx="40" ry="5" opacity=".45" />
        {[[96, 380, 2], [118, 372, 1.6], [150, 390, 2.2], [168, 378, 1.4], [330, 384, 1.8], [372, 386, 2], [392, 376, 1.4], [420, 390, 1.6]].map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
      </g>

      {/* Wheat stalks */}
      <WheatStalk x={92} y={350} length={190} lean={60} />
      <WheatStalk x={110} y={352} length={170} lean={92} />
      <WheatStalk x={74} y={348} length={160} lean={30} />

      {/* Baguette */}
      <g transform="rotate(-13 300 298)">
        <rect x="140" y="272" width="320" height="46" rx="23" fill="var(--baguette)" {...line} />
        {[176, 226, 276, 326, 376].map(x => (
          <ellipse key={x} cx={x + 18} cy="289" rx="22" ry="5.5" transform={`rotate(-14 ${x + 18} 289)`} fill="var(--score)" />
        ))}
        <path d="M160 282c30-4 70-6 110-5" fill="none" stroke="var(--art-shine)" strokeWidth="4" strokeLinecap="round" />
        <path d="M152 306H448" stroke="var(--art-shade)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Cinnamon bun */}
      <g>
        <path d="M374 328c0-24 18-42 42-42s42 18 42 42c0 16-18 26-42 26s-42-10-42-26z" fill="var(--bun)" {...line} />
        <path d="M416 318c-3 0-4-5 0-5 7 0 8 11 0 11-11 0-11-19 2-19 15 0 16 25-2 25-18 0-20-29 1-32" fill="none" stroke="var(--bun-swirl)" strokeWidth="4" strokeLinecap="round" />
        <path d="M384 306c10 8 18-6 28 2s18-6 28 2" fill="none" stroke="var(--icing)" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Croissants */}
      <Croissant transform="translate(436 326) rotate(-14) scale(1.35)" />
      <Croissant transform="translate(338 300) scale(1.95)" />

      {/* Scored sourdough boule */}
      <g>
        <path d="M108 376C108 300 158 246 220 246S332 300 332 376C332 390 320 398 302 398H138C120 398 108 390 108 376Z" fill="var(--crust)" {...line} />
        <path d="M112 372c20 10 60 14 108 14s88-4 108-14c2 14-8 24-26 26H138c-18-2-28-12-26-26z" fill="var(--crust-dark)" opacity=".55" />
        <path d="M146 318C178 282 264 276 304 304C264 314 184 312 146 318Z" fill="var(--score)" />
        <path d="M146 318C178 282 264 276 304 304" fill="none" stroke="var(--crust-dark)" strokeWidth="4" strokeLinecap="round" />
        <path d="M156 352C190 338 252 336 290 346" fill="none" stroke="var(--score)" strokeWidth="7" strokeLinecap="round" />
        <path d="M132 316c8-24 26-44 50-56" fill="none" stroke="var(--crust-light)" strokeWidth="6" strokeLinecap="round" opacity=".7" />
        <g fill="var(--flour)">
          {flourOnBoule.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
        </g>
      </g>

      {/* Steam rising from the loaf */}
      <g className="scene__steam" fill="none" stroke="var(--steam)" strokeWidth="5" strokeLinecap="round">
        <path d="M196 236c-12-12 12-20 0-34s10-20 0-32" />
        <path d="M224 230c-12-12 12-20 0-34s10-20 0-32" />
        <path d="M252 236c-12-12 12-20 0-34s10-20 0-32" />
      </g>

      {/* Flour drifting in the light */}
      <g className="scene__flour" fill="var(--flour)">
        {drift.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
      </g>
    </svg>
  );
}

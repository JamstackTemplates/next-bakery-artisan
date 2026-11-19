import type { CSSProperties } from 'react';
import { asset } from '../lib/paths';

// The home page photograph: sourdough, a baguette, croissants and a cinnamon bun on a floured board,
// in morning light (public/hero-light.webp) or before a glowing wood-fired oven (public/hero-dark.webp).
// The pair is chosen by the `.hero-art` styles in app/tailwind.input.css so it follows the theme toggle,
// and only the active theme's photo is downloaded. Decorative only — the page text carries all information.

export function HeroImage() {
  const style = {
    '--hero-light': `url("${asset('/hero-light.webp')}")`,
    '--hero-dark': `url("${asset('/hero-dark.webp')}")`,
  } as CSSProperties;
  return <div className="hero-art aspect-square w-full" style={style} aria-hidden="true" />;
}

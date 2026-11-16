import type { ReactNode } from 'react';

/** Heading block for inner pages: eyebrow, large serif title (use <em> for the accent words), a lede and an optional illustration. */
export function PageHead({ eyebrow, title, children, id, before, aside }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
  /** Optional illustration or stamp beside the title on wide screens. */
  aside?: ReactNode;
}) {
  return (
    <header className="wrap grid items-center gap-6 pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(1.5rem,3vw,2.5rem)] md:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        {before}
        <p className="eyebrow">{eyebrow}</p>
        <h1 id={id} className="mt-3 mb-5 max-w-[18ch] text-[clamp(2.6rem,6.5vw,4.6rem)] tracking-[-.025em]">{title}</h1>
        {children ? <div className="max-w-(--measure) text-[clamp(1.08rem,1.6vw,1.22rem)] text-muted">{children}</div> : null}
      </div>
      {aside ? <div className="max-md:hidden">{aside}</div> : null}
    </header>
  );
}

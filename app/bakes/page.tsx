import type { Metadata } from 'next';
import { BakeBoard } from '../../components/bake-board';
import { BakeArt } from '../../components/bake-art';
import { Icon } from '../../components/icons';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { bakery, formatTime } from '../../content/bakery';
import { bakes } from '../../content/bakes';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Bakes',
  description: `Sourdough, viennoiserie, sweet things and lunch at ${bakery.name}, with prices and oven times.`,
  alternates: { canonical: absoluteUrl('/bakes/') },
};

const firstOpen = bakery.hours.find(entry => entry.opens)?.opens;

export default function BakesPage() {
  return (
    <>
      <PageHead eyebrow="Bakes" title={<>Bread, pastries &amp; <em>things in between</em></>}
        aside={<BakeArt art="boule" color="#a8622a" size={150} className="rotate-[-6deg]" />}>
        <p>
          Everything is shaped by hand and baked here in small batches{firstOpen ? `, from ${formatTime(firstOpen)}` : ''}. Times show when each batch
          usually comes out of the oven. When something sells out, it’s gone until the next bake.
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,4vw,3rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <BakeBoard />

        <aside className="mt-4 grid gap-4 max-lg:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" aria-labelledby="allergens-title">
          <div className="card p-[1.4rem]">
            <h2 id="allergens-title" className="mb-3 flex items-center gap-2 text-[1.3rem]"><Icon name="leaf" width={20} height={20} className="text-sage" />Allergens</h2>
            <div className="grid gap-3 text-[.92rem] text-muted">
              {bakes.notes.map(note => <p key={note}>{note}</p>)}
            </div>
          </div>
          <div className="grid gap-3 rounded-card bg-wheat-soft p-[1.4rem] text-[.95rem]">
            <h2 className="text-[1.3rem]">Want a loaf held for you?</h2>
            <p className="text-muted">Send us a note by 2pm the day before with what you’d like and when you’ll collect. We’ll reply to confirm.</p>
            <p><SiteLink href="/contact/" className="text-link">Send us a note</SiteLink></p>
          </div>
        </aside>
      </div>
    </>
  );
}

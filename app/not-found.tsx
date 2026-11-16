import type { Metadata } from 'next';
import { BakeArt } from '../components/bake-art';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pb-(--space-section)" aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" title={<>This one <em>didn’t rise…</em></>}
        before={<BakeArt art="boule" color="#7a4118" size={96} className="mb-3 -rotate-6" />}>
        <p>The link may be out of date, or the page may have moved. Here’s what’s fresh instead:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/bakes/" className="text-link">Today’s bakes</SiteLink></li>
        <li><SiteLink href="/cakes/" className="text-link">Celebration cakes</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
        <li><SiteLink href="/contact/" className="text-link">Contact</SiteLink></li>
      </ul>
    </section>
  );
}

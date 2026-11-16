import type { Metadata } from 'next';
import { BakeArt } from '../../components/bake-art';
import { CakeArt } from '../../components/cake-art';
import { CopyEmail } from '../../components/copy-email';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { bakery } from '../../content/bakery';
import { cakes } from '../../content/cakes';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Custom cakes, pre-orders & enquiries',
  description: `Ask ${bakery.name} about celebration cakes, holding a loaf, larger orders or wholesale.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 text-[1.3rem]';
const minNotice = Math.min(...cakes.map(cake => cake.leadDays));

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return (
    <>
      <PageHead eyebrow="Contact" title={<>Custom cakes, pre‑orders <em>&amp; enquiries</em></>}
        aside={<div className="w-60"><CakeArt cake={cakes.find(cake => cake.id === 'lemon-elderflower') ?? cakes[0]} idPrefix="head" /></div>}>
        <p>
          Planning a celebration cake, want a few loaves held for Saturday, or looking for bread for your café? Send us a
          note and someone from the bakery will reply, usually within two working days. A message is an enquiry: nothing is
          ordered or paid for until we reply to confirm.
        </p>
      </PageHead>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(1rem,3vw,2rem)] pb-(--space-section) lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={bakery.email} />
          ) : (
            <div className="card grid justify-items-start gap-[1.1rem] rounded-panel p-[clamp(1.5rem,4vw,2.75rem)] shadow-card">
              <BakeArt art="cake-slice" color="#a3243a" size={84} />
              <h2 className="text-[clamp(1.7rem,3vw,2.2rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us about celebration cakes, pre-orders and wholesale. Tell us what you’d like,
                the date you need it and roughly how many people, and we’ll get back to you with a price and availability.
              </p>
              <p><a className="button" href={`mailto:${bakery.email}?subject=${encodeURIComponent('Cake or pre-order enquiry')}`}>Email {bakery.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-display text-[1.35rem] wrap-anywhere"><a className="text-link" href={`mailto:${bakery.email}`}>{bakery.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={bakery.email} /></p>

          {bakery.phone ? (
            <>
              <h2 className={`mt-4 ${subhead}`}>Phone</h2>
              <p><a className="text-link" href={`tel:${bakery.phone.replace(/[^\d+]/g, '')}`}>{bakery.phone}</a></p>
            </>
          ) : null}

          <h2 className={`mt-4 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {['The date you need it', 'How many people it’s for (servings)', 'The flavours or bakes you’d like', 'Any allergies we should know about'].map(tip => (
              <li key={tip} className="relative pl-6 before:absolute before:top-0 before:left-0 before:text-wheat before:content-['✻']">{tip}</li>
            ))}
          </ul>
          <p className="mt-4 text-[.92rem] text-muted">
            Cakes need at least {minNotice} days’ notice; each one’s lead time is on the <SiteLink href="/cakes/" className="text-link">cakes page</SiteLink>.
          </p>
        </aside>
      </div>
    </>
  );
}

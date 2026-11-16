import type { Metadata } from 'next';
import { CakeArt } from '../../components/cake-art';
import { Icon } from '../../components/icons';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { bakery } from '../../content/bakery';
import { formatPrice } from '../../content/bakes';
import { cakes, howItWorks, type Cake } from '../../content/cakes';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Celebration cakes',
  description: `Celebration and wedding cakes made to order at ${bakery.name}: flavours, sizes, servings and notice.`,
  alternates: { canonical: absoluteUrl('/cakes/') },
};

const notice = (days: number) => days >= 14 && days % 7 === 0 ? `${days / 7} weeks’ notice` : `${days} day${days === 1 ? '' : 's'}’ notice`;

function CakeCard({ cake }: { cake: Cake }) {
  return (
    <li id={cake.id} className="cake-card card flex scroll-mt-4 flex-col rounded-panel p-[clamp(1.25rem,2.5vw,1.75rem)] shadow-card">
      <div className="mx-auto flex h-52 w-full max-w-64 items-end justify-center px-2 pt-2">
        <CakeArt cake={cake} className="max-h-full" />
      </div>
      <h2 className="mt-4 text-[1.6rem]">{cake.name}</h2>
      <p className="mt-1.5 text-[.97rem] text-muted">{cake.description}</p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[.92rem]">
        <dt className="font-bold">Sponge</dt><dd className="text-muted">{cake.flavours.sponge}</dd>
        <dt className="font-bold">Filling</dt><dd className="text-muted">{cake.flavours.filling}</dd>
        <dt className="font-bold">Frosting</dt><dd className="text-muted">{cake.flavours.frosting}</dd>
      </dl>
      <table className="mt-4 w-full text-[.93rem]">
        <caption className="sr-only">Sizes and prices for {cake.name}</caption>
        <thead className="sr-only"><tr><th scope="col">Size</th><th scope="col">Serves</th><th scope="col">Price</th></tr></thead>
        <tbody>
          {cake.sizes.map(size => (
            <tr key={`${size.label ?? ''}${size.diameter}`} className="border-b border-dashed border-line-strong last:border-0">
              <th scope="row" className="py-1.5 text-left font-semibold">{size.label ? `${size.label} · ` : ''}{size.diameter}″</th>
              <td className="py-1.5 text-muted">serves {size.servings}</td>
              <td className="py-1.5 text-right font-display text-[1.08rem] font-semibold text-accent">{cake.fromPrice ? 'from ' : ''}{formatPrice(size.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <span className="sticker sticker-seasonal inline-flex items-center gap-1"><Icon name="calendar" width={13} height={13} />{notice(cake.leadDays)}</span>
        {cake.diet?.map(note => <span key={note} className={`sticker ${note.toLowerCase() === 'vegan' ? 'sticker-weekend' : ''}`}>{note}</span>)}
      </p>
    </li>
  );
}

export default function CakesPage() {
  return (
    <>
      <PageHead eyebrow="Celebration cakes" title={<>Cakes worth <em>gathering round</em></>}
        aside={<div className="w-56"><CakeArt cake={cakes[0]} idPrefix="head" /></div>}>
        <p>
          Layered celebration cakes, made to order. Pick a cake below, or describe your own — then send us an enquiry with the
          date and how many people. Nothing is ordered or paid for until we reply to confirm.
        </p>
      </PageHead>

      <section className="wrap" aria-label="Cakes">
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cakes.map(cake => <CakeCard key={cake.id} cake={cake} />)}
        </ul>
      </section>

      <section id="how-it-works" className="wrap section-y" aria-labelledby="how-title">
        <p className="eyebrow">Custom cakes</p>
        <h2 id="how-title" className="mt-2 text-[clamp(2rem,4.4vw,3.1rem)]">How custom cakes work</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <li key={step.title} className="drop-shadow-[0_8px_12px_rgba(60,30,10,.14)]">
              <div className="kraft h-full px-5 pb-6">
                <span className="batch-label block text-[2rem] text-accent-strong">{index + 1}.</span>
                <h3 className="mt-1 text-[1.25rem]">{step.title}</h3>
                <p className="mt-2 text-[.95rem] opacity-85">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="card mt-10 grid items-center gap-x-8 gap-y-4 rounded-panel p-[clamp(1.5rem,3.5vw,2.5rem)] shadow-card md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)]">Planning a celebration?</h2>
            <p className="mt-2 max-w-(--measure) text-muted">
              Send us an enquiry with the date, how many people and the flavours you like. It’s just a message: we’ll reply
              with a price and availability, and nothing is booked or charged until you confirm by email.
            </p>
          </div>
          <p><SiteLink href="/contact/" className="button">Send a cake enquiry <Icon name="arrow" width={18} height={18} /></SiteLink></p>
        </div>
      </section>
    </>
  );
}

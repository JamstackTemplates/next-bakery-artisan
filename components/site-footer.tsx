import { bakery, formatAddress, groupedHours, publicLinks } from '../content/bakery';
import { Icon } from './icons';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 flex font-sans items-center gap-2 text-[.78rem] font-bold tracking-[.16em] text-footer-wheat uppercase';
const footerLink = 'text-footer-ink font-semibold underline decoration-footer-wheat/50 underline-offset-[.2em] hover:text-footer-wheat hover:decoration-footer-wheat';

export function SiteFooter() {
  const year = new Date().getFullYear();
  // Scalloped top edge, like the rim of a bread tin: the same edge as the header and the story band.
  return (
    <footer className="site-footer scallop-top relative mt-16 bg-footer text-footer-ink [--scallop-fill:var(--footer-bg)] [--scallop-r:18px]">
      <div className="wrap grid gap-x-12 gap-y-8 pt-12 pb-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display font-wonk text-[2rem] leading-tight font-semibold text-footer-ink">{bakery.name}</p>
          <p className="mb-4 text-[.95rem] text-footer-soft">{bakery.tagline}</p>
          <address className="leading-[1.8] text-footer-ink not-italic">
            {formatAddress()}<br />
            {bakery.address.note ? <span className="text-[.92rem] text-footer-muted">{bakery.address.note}<br /></span> : null}
            <a className={footerLink} href={`mailto:${bakery.email}`}>{bakery.email}</a>
            {bakery.phone ? <><br /><a className={footerLink} href={`tel:${bakery.phone.replace(/[^\d+]/g, '')}`}>{bakery.phone}</a></> : null}
          </address>
        </div>
        <div>
          <h2 className={heading}><Icon name="clock" width={16} height={16} />Hours</h2>
          <ul className="text-[.95rem]">
            {groupedHours().map(group => (
              <li key={group.label} className="flex justify-between gap-4 border-b border-dashed border-white/15 py-2">
                <span>{group.label}</span><span className="tabular-nums">{group.hours}</span>
              </li>
            ))}
          </ul>
          <TimeZoneNote className="text-footer-muted" />
        </div>
        <div>
          <h2 className={heading}><Icon name="wheat" width={16} height={16} />Around the bakery</h2>
          <ul className="grid gap-2 font-semibold [&_a]:no-underline [&_a:hover]:text-footer-wheat [&_a:hover]:underline">
            <li><SiteLink href="/bakes/">Today’s bakes</SiteLink></li>
            <li><SiteLink href="/cakes/">Celebration cakes</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Cakes, pre-orders &amp; enquiries</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <p className="wrap flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-white/12 pt-5 pb-8 text-[.88rem] text-footer-muted">
        <span>© {year} {bakery.name} · baked by hand, in small batches</span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-footer-wheat hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </p>
    </footer>
  );
}

import { DarkModeToggle } from 'jamstacks';
import { bakery } from '../content/bakery';
import { Logo } from './logo';
import { SiteLink } from './site-link';

const navigation = [
  { href: '/bakes/', label: 'Bakes' },
  { href: '/cakes/', label: 'Cakes' },
  { href: '/contact/', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md backdrop-saturate-150">
      <div className="wrap flex min-h-(--header-h) items-center justify-between gap-3">
        <SiteLink href="/" className="inline-flex min-w-0 items-center gap-2.5 no-underline">
          <Logo className="flex-none max-sm:size-8" />
          <span className="font-display font-soft text-[1.2rem] leading-none font-semibold tracking-[-.01em] whitespace-nowrap max-[400px]:sr-only sm:text-[1.5rem]">{bakery.name}</span>
        </SiteLink>
        <div className="flex items-center gap-1 sm:gap-3 print:hidden">
          <nav aria-label="Main">
            <ul className="flex gap-0.5 sm:gap-1">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section"
                    className="inline-block rounded-ui px-2 py-1.5 font-semibold text-muted no-underline transition-colors hover:bg-surface-2 hover:text-ink aria-[current]:bg-accent-soft aria-[current]:text-ink xs:px-2.5 sm:px-3.5">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}

import type { ReactNode, SVGProps } from 'react';
import type { Amenity } from '../content/bakery';

// Small hand-drawn style line icons. Decorative: always paired with visible text.
type IconName = Amenity['icon'] | 'clock' | 'pin' | 'phone' | 'mail' | 'arrow' | 'filter' | 'wheat' | 'flame' | 'calendar' | 'users' | 'ruler';

const paths: Record<IconName, ReactNode> = {
  bag: <><path d="M5.5 8h13l-1 12.5h-11z" /><path d="M5.5 8l1.5-4h10l1.5 4" /><path d="M9 11.5c0 2 1.3 3 3 3s3-1 3-3" /></>,
  knife: <><path d="M4 20L15.5 8.5" /><path d="M15.5 8.5l3-3a2 2 0 0 1 2.5 2.5l-6 6-2-2" /><path d="M6.5 14.5l1 1M9 12l1 1" /></>,
  paw: <><ellipse cx="12" cy="16" rx="4.2" ry="3.4" /><circle cx="6.2" cy="11" r="1.7" /><circle cx="9.5" cy="7.3" r="1.7" /><circle cx="14.5" cy="7.3" r="1.7" /><circle cx="17.8" cy="11" r="1.7" /></>,
  cup: <><path d="M4.5 9h12v5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" /><path d="M16.5 10.5h1.5a2.5 2.5 0 0 1 0 5h-1.8" /><path d="M8.5 3.5c-1 1 1 2 0 3.2M12.5 3.5c-1 1 1 2 0 3.2" /></>,
  leaf: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l8-8" /></>,
  tag: <><path d="M3.5 12.5V4.5h8l9 9-8 8z" /><circle cx="8" cy="9" r="1.4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7l7.5 6 7.5-6" /></>,
  arrow: <><path d="M5 12h13" /><path d="M13 7l5 5-5 5" /></>,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  wheat: <><path d="M12 22V7" /><path d="M12 2.5c1.8 1.8 1.8 3.6 0 5.4-1.8-1.8-1.8-3.6 0-5.4zM12 8c2.8 0 4.6 1.6 4.6 3.6-2.8 0-4.6-1-4.6-3.6zM12 8c-2.8 0-4.6 1.6-4.6 3.6 2.8 0 4.6-1 4.6-3.6zM12 13c2.8 0 4.6 1.6 4.6 3.6-2.8 0-4.6-1-4.6-3.6zM12 13c-2.8 0-4.6 1.6-4.6 3.6 2.8 0 4.6-1 4.6-3.6z" /></>,
  flame: <path d="M12 21c-4 0-6.5-2.6-6.5-6 0-4 3.5-5.5 3.5-9.5 2.5 1.5 4 3.5 4 6 1-.8 1.5-2 1.5-3.2 2 1.6 4 4 4 6.7 0 3.4-2.5 6-6.5 6z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" /><path d="M15.5 5.5a3 3 0 0 1 0 6M17.5 14.3c2 .7 3.2 2.5 3.5 5.2" /></>,
  ruler: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M7 10.5v3M12 10v4M17 10.5v3" /></>,
};

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {paths[name]}
    </svg>
  );
}

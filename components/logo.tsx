/** Small scored-boule mark used beside the bakery name. Decorative. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg className={`size-[36px] ${className}`} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="19" fill="var(--wheat-soft)" />
      <path d="M7 27c0-9 6-16 13-16s13 7 13 16c0 2-1.5 3-3.5 3h-19C8.5 30 7 29 7 27z" fill="var(--accent)" />
      <path d="M12 21c4-4 12-4.5 16-1.5" fill="none" stroke="var(--wheat-soft)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 25.5c4-1.5 10-1.5 14 0" fill="none" stroke="var(--wheat-soft)" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
      <circle cx="17" cy="14.5" r=".9" fill="var(--wheat-soft)" /><circle cx="22.5" cy="14" r=".7" fill="var(--wheat-soft)" />
    </svg>
  );
}

type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** FU monogram inside a tennis ball — tuned for ~34px header size */
export function BrandMark({ className = "brand__mark", title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {/* ball */}
      <circle cx="20" cy="20" r="19" fill="#c8f000" />
      {/* classic curved seams */}
      <path
        d="M6.2 7.5C13.2 12.2 13.2 27.8 6.2 32.5"
        stroke="#0a0c10"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        d="M33.8 7.5C26.8 12.2 26.8 27.8 33.8 32.5"
        stroke="#0a0c10"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      {/* F */}
      <path
        fill="#0a0c10"
        d="M9.2 11.2h10.6v3.1H12.6v4.2h8.2v2.85H12.6V28.8H9.2V11.2Z"
      />
      {/* U */}
      <path
        fill="#0a0c10"
        d="M21.4 11.2h3.35v10.2c0 2.05.95 3.15 2.55 3.15s2.55-1.1 2.55-3.15V11.2H33.2v10.4c0 3.85-2.2 6-5.9 6s-5.9-2.15-5.9-6V11.2Z"
      />
    </svg>
  );
}

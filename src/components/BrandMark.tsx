type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** FU monogram with lime tennis-ball accent */
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
      <rect width="40" height="40" fill="#0a0c10" />
      <rect
        x="1.5"
        y="1.5"
        width="37"
        height="37"
        stroke="#c8f000"
        strokeWidth="1.5"
      />
      {/* F */}
      <path
        fill="#ffffff"
        d="M7.5 8.5h13v3.2H11v4.8h8.2v3H11V31.5H7.5V8.5Z"
      />
      {/* U — shortened to leave room for ball */}
      <path
        fill="#ffffff"
        d="M22.5 8.5h3.5v12.2c0 2.9 1.35 4.4 3.55 4.4s3.55-1.5 3.55-4.4V8.5H36.6v12.4c0 4.9-2.95 7.6-6.55 7.6-3.6 0-6.55-2.7-6.55-7.6V8.5Z"
      />
      {/* tennis ball */}
      <circle cx="31.8" cy="31.5" r="4.35" fill="#c8f000" />
      <path
        d="M28.9 29.85c1.15 1.75 2.85 2.7 4.85 2.8"
        stroke="#0a0c10"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

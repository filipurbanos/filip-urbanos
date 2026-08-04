type BrandMarkProps = {
  className?: string;
  title?: string;
};

/** FU monogram — lime frame + ball accent, tuned for ~34px header size */
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
        strokeWidth="2"
      />
      {/* F — heavier bars for small size */}
      <path
        fill="#ffffff"
        d="M6.5 7.5h14.2v3.6H10.5v5.1h8.8v3.4H10.5V32.5H6.5V7.5Z"
      />
      {/* U */}
      <path
        fill="#ffffff"
        d="M22 7.5h4v13.4c0 2.6 1.2 4 3.2 4s3.2-1.4 3.2-4V7.5h4v13.6c0 4.85-2.75 7.5-7.2 7.5S22 26 22 21.1V7.5Z"
      />
      {/* ball */}
      <circle cx="32.2" cy="32" r="5" fill="#c8f000" />
      <path
        d="M28.9 30.1c1.3 2 3.2 3.1 5.4 3.2"
        stroke="#0a0c10"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

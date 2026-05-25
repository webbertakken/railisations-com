import type { SVGProps } from "react";

export type BrandLogoProps = Omit<SVGProps<SVGSVGElement>, "aria-label"> & {
  /** When supplied, the logo is exposed as an `img` with this label. */
  label?: string;
};

/**
 * Brass cog gear that doubles as the favicon
 * (`src/app/icon.svg`). Rendered inline so the header can colour-match
 * it with the rest of the copper palette without an extra network hop.
 */
export function BrandLogo({ label, className, ...rest }: BrandLogoProps) {
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": "true" } as const);

  return (
    <svg
      viewBox="0 0 64 64"
      width={40}
      height={40}
      className={className}
      {...a11y}
      {...rest}
    >
      <defs>
        <radialGradient id="brand-copper" cx="32%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#ffdcc2" />
          <stop offset="55%" stopColor="#d98c45" />
          <stop offset="100%" stopColor="#532b00" />
        </radialGradient>
        <radialGradient id="brand-rivet" cx="30%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffe2c8" />
          <stop offset="60%" stopColor="#ffb77a" />
          <stop offset="100%" stopColor="#6d3a00" />
        </radialGradient>
      </defs>

      {/* 12 radial teeth */}
      <g transform="translate(32 32)" fill="url(#brand-copper)" stroke="#2e1500" strokeWidth={1.5}>
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i} transform={`rotate(${i * 30})`}>
            <rect x={-3.5} y={-26} width={7} height={8} rx={1.2} />
          </g>
        ))}
        <circle r={20} />
      </g>

      {/* ornate inner ring */}
      <g transform="translate(32 32)" fill="none" stroke="#532b00" strokeWidth={1.2} opacity={0.6}>
        <circle r={14} />
        <circle r={10} />
      </g>

      {/* centre rivet */}
      <g transform="translate(32 32)">
        <circle r={6} fill="url(#brand-rivet)" stroke="#2e1500" strokeWidth={1.5} />
        <circle r={2.2} cx={-1.5} cy={-1.5} fill="#ffdcc2" opacity={0.85} />
      </g>
    </svg>
  );
}

/**
 * The `Railisations` wordmark - the inner "ai" rendered in a lighter
 * copper (`text-primary-fixed`, `#ffdcc2`) against the standard
 * luminous copper (`text-primary`, `#ffb77a`). The lowercase keeps
 * the wordmark visually calm while the colour shift quietly nods to
 * the AI inside the name.
 */
export function BrandMark() {
  return (
    <span
      data-testid="brand-mark"
      className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary font-semibold tracking-tight leading-none"
    >
      <span>R</span>
      <span className="text-primary-fixed">ai</span>
      <span>lisations</span>
    </span>
  );
}

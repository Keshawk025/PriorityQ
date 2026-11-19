import React from 'react';

/**
 * PrioritiQ Logo Icon Mark
 *
 * Visual Concept:
 * - Geometric "P" monogram representing PrioritiQ
 * - Tri-color priority triage triad honoring the application's core logic:
 *   - Red (#EF4444): High Priority (P1 Emergency Breakdown)
 *   - Amber (#F59E0B): Medium Priority (P2 Preventative Maintenance)
 *   - Green (#10B981): Low Priority (P3 Routine Inquiries)
 * - Encapsulated in a high-contrast precision squircle
 */
export const LogoIcon = ({ size = 28, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      {/* Precision Squircle Frame */}
      <rect
        width="44"
        height="44"
        rx="10"
        className="fill-neutral-950 dark:fill-[#121212] stroke-neutral-800 dark:stroke-[#2A2A2A]"
        strokeWidth="1.5"
      />

      {/* Monogram P (Stem & Upper Loop) */}
      <path
        d="M12 10C12 9.44772 12.4477 9 13 9H24C28.4183 9 32 12.5817 32 17C32 21.4183 28.4183 25 24 25H18V34C18 34.5523 17.5523 35 17 35H13C12.4477 35 12 34.5523 12 34V10Z"
        fill="#FFFFFF"
      />
      {/* P Inner Aperture */}
      <path
        d="M18 14.5H23.5C24.8807 14.5 26 15.6193 26 17C26 18.3807 24.8807 19.5 23.5 19.5H18V14.5Z"
        className="fill-neutral-950 dark:fill-[#121212]"
      />

      {/* Priority Tiers: High (Red), Medium (Amber), Low (Green) */}
      <circle cx="22" cy="30.5" r="2.6" fill="#EF4444" />
      <circle cx="28" cy="30.5" r="2.6" fill="#F59E0B" />
      <circle cx="34" cy="30.5" r="2.6" fill="#10B981" />
    </svg>
  );
};

/**
 * Full PrioritiQ Brand Logo
 * Combines the LogoIcon mark with high-resolution typography and optional desk badge.
 */
export const Logo = ({
  size = 28,
  badgeText = 'Commercial Parts Desk',
  showBadge = true,
  className = '',
  textClassName = '',
  badgeClassName = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} />
      <div className="flex items-center gap-2">
        <span className={`font-bold text-text text-sm tracking-tight transition-colors ${textClassName}`}>
          Prioriti<span className="text-text">Q</span> <span className="font-semibold text-text-secondary text-xs">CRM</span>
        </span>
        {showBadge && badgeText && (
          <span
            className={`hidden sm:inline-flex rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted font-mono ${badgeClassName}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;

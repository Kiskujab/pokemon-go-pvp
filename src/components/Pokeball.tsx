interface Props {
  className?: string;
  spinning?: boolean;
}

/** A small CSS-animatable poké ball drawn as inline SVG (no image fetch). */
export default function Pokeball({ className, spinning }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={
        spinning
          ? { animation: "pogo-spin 1s linear infinite", transformOrigin: "50% 50%" }
          : undefined
      }
      aria-hidden="true"
    >
      <defs>
        <clipPath id="pb-clip">
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      <g clipPath="url(#pb-clip)">
        <rect x="0" y="0" width="100" height="50" fill="#ef4444" />
        <rect x="0" y="50" width="100" height="50" fill="#f8fafc" />
      </g>
      <rect x="0" y="46" width="100" height="8" fill="#0e0e10" />
      <circle cx="50" cy="50" r="46" fill="none" stroke="#0e0e10" strokeWidth="6" />
      <circle cx="50" cy="50" r="15" fill="#0e0e10" />
      <circle cx="50" cy="50" r="10" fill="#f8fafc" />
      <circle cx="50" cy="50" r="5" fill="#cbd5e1" />
    </svg>
  );
}

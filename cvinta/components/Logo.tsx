export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="#1F6F54" />
      <path
        d="M17 13h9.5l4.5 4.5V35a1 1 0 0 1-1 1H17a1 1 0 0 1-1-1V14a1 1 0 0 1 1-1z"
        fill="none"
        stroke="#FAFAF7"
        strokeWidth="1.8"
      />
      <path
        d="M26.5 13v4.5H31"
        fill="none"
        stroke="#FAFAF7"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M19.5 25.5l3 3 6-6.5"
        fill="none"
        stroke="#FAFAF7"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

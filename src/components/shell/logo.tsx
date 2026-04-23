export function PiramidMark({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <path d="M12 3 L21 20 L3 20 Z" fill="#F5893A" />
      <path d="M12 3 L12 20" stroke="#141414" strokeWidth="1.5" />
    </svg>
  );
}

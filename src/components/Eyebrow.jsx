export default function Eyebrow({ children, className = "" }) {
  return (
    <p
      className={`reveal mb-4 inline-flex items-center gap-3 text-sm font-semibold tracking-[0.2em] text-accent-text uppercase ${className}`}
    >
      {children}
    </p>
  );
}

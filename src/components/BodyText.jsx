export default function BodyText({ children, className = "" }) {
  return (
    <p
      className={`reveal mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.75] text-pretty text-ink-muted sm:text-lg lg:text-xl ${className}`}
    >
      {children}
    </p>
  );
}

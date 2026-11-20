import { Link } from "react-router-dom";

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-transparent px-6 text-base font-semibold whitespace-nowrap transition duration-300 ease-smooth";

const variants = {
  primary:
    "bg-linear-to-br from-accent-deep to-accent-mid text-white shadow-[0_10px_28px_-10px_rgba(20,86,216,0.85),inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-10px_rgba(31,111,229,0.95),inset_0_1px_0_rgba(255,255,255,0.3)]",
  ghost:
    "border-line-strong bg-surface text-ink hover:border-white/30 hover:bg-surface-hover",
};

// Full width on phones (easy thumb target); className can change that
export default function ButtonLink({ to, variant = "primary", className = "", children }) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

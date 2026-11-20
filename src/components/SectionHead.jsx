import Eyebrow from "./Eyebrow.jsx";

// Small label + the page's single <h1>
export default function SectionHead({ id, eyebrow, title, className = "" }) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1
        id={id}
        data-split
        className="font-display text-[2.4rem] leading-[1.05] font-semibold tracking-[-0.025em] sm:text-5xl lg:text-6xl"
      >
        {title}
      </h1>
    </div>
  );
}

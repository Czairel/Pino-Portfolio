// One row of skills: a muted label followed by compact pill chips
export default function SkillCard({ group }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <h3 className="w-20 shrink-0 text-base font-semibold text-ink-muted">{group.group}</h3>
      <ul aria-label={`${group.group} skills`} className="flex flex-wrap gap-2.5">
        {group.items.map((item) => (
          <li
            key={item.name}
            className="rounded-full border border-line bg-white/5 px-4 py-1.5 text-base font-medium text-ink"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

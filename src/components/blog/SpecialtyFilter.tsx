import Link from "next/link";
import { SPECIALTIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SpecialtyFilter({ active }: { active?: string }) {
  return (
    <nav aria-label="Lọc theo chuyên khoa" className="flex flex-wrap gap-2">
      <FilterChip href="/blog" label="Tất cả" icon="📚" isActive={!active} />
      {SPECIALTIES.map((s) => (
        <FilterChip
          key={s.slug}
          href={`/blog?specialty=${s.slug}`}
          label={s.name}
          icon={s.icon}
          isActive={active === s.slug}
        />
      ))}
    </nav>
  );
}

function FilterChip({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium border transition",
        isActive
          ? "bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]"
          : "bg-white text-[color:var(--color-text)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary-dark)]"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <span aria-hidden>{icon}</span>
      {label}
    </Link>
  );
}

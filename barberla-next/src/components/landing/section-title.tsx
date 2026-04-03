import { Badge } from "@/components/ui/badge";

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="mx-auto mb-10 max-w-2xl space-y-4 text-center md:mb-14">
      <Badge className="mx-auto w-fit" variant="outline">
        {eyebrow}
      </Badge>
      <h2 className="text-balance text-3xl font-bold tracking-[-0.02em] text-[var(--color-text)] md:text-4xl">{title}</h2>
      <p className="text-pretty text-base leading-7 text-[var(--color-muted)]">{description}</p>
    </div>
  );
}

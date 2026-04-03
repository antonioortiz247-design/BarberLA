import { Card } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group h-full p-5 md:p-6">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-primary)] transition group-hover:scale-105">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[var(--color-text)]">{title}</h3>
      <p className="text-sm leading-6 text-[var(--color-muted)]">{description}</p>
    </Card>
  );
}

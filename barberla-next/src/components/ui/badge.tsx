import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline";

const badgeStyles: Record<BadgeVariant, string> = {
  default: "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/12 text-[var(--color-primary-foreground)]",
  secondary: "border-[var(--color-secondary)]/35 bg-[var(--color-secondary)]/10 text-[var(--color-text)]",
  outline: "border-[var(--color-border)] bg-transparent text-[var(--color-muted)]",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.12em]",
        badgeStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

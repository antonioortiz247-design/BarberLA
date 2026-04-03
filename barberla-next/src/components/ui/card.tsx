import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 shadow-[var(--shadow-soft)] backdrop-blur-sm transition duration-200 hover:border-[var(--color-primary)]/50",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };

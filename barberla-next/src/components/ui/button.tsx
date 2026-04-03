import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "default" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  default:
    "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--color-primary-hover)]",
  secondary:
    "bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] shadow-[var(--shadow-soft)] hover:bg-[var(--color-secondary-hover)]",
  outline:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs",
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface SharedProps {
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

type ButtonProps = SharedProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = SharedProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function baseClassName({ className, variant = "default", size = "default" }: SharedProps) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] font-semibold tracking-[0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:pointer-events-none disabled:opacity-45",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

function Button(props: ButtonProps) {
  const { className, variant = "default", size = "default", ...rest } = props;

  return <button className={baseClassName({ className, variant, size })} {...rest} />;
}

function ButtonLink(props: ButtonLinkProps) {
  const { className, variant = "default", size = "default", href, ...rest } = props;

  return <Link className={baseClassName({ className, variant, size })} href={href} {...rest} />;
}

export { Button, ButtonLink };

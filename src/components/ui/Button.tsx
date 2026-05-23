import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

interface ButtonProps extends BaseProps, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: never;
}

interface LinkProps extends BaseProps {
  href: string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  // CTA chính - cam đỏ
  primary:
    "bg-[color:var(--color-accent)] text-white hover:bg-[color:var(--color-accent-dark)] shadow-md shadow-red-900/10",
  // CTA phụ - xanh lá
  secondary:
    "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-dark)] shadow-md shadow-green-900/10",
  // Outline xanh
  outline:
    "border-2 border-[color:var(--color-primary)] text-[color:var(--color-primary-dark)] hover:bg-[color:var(--color-primary)] hover:text-white",
  // Text only
  ghost: "text-[color:var(--color-text)] hover:bg-[color:var(--color-primary-bg)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if ("href" in props && props.href) {
    if (props.external) {
      return (
        <a href={props.href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...buttonProps } = props as ButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

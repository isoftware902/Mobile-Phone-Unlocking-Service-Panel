import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card = ({
  className,
  title,
  subtitle,
  footer,
  children,
  ...props
}: CardProps) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border">
          {title && <h3 className="text-lg font-semibold leading-none tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-muted mt-1.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && <div className="px-6 py-4 bg-slate-50/50 border-t border-border">{footer}</div>}
    </div>
  );
};

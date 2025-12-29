"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
  children?: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };

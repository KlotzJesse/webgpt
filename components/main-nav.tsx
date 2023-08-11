"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavList = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const currentPath = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {NavList.map((item) => (
        <Link
          href={item.href}
          key={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            currentPath !== item.href && "text-muted-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

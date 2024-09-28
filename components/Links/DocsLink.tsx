import { cn } from "@/lib/utils";
import { LucideLink } from "lucide-react";
import Link from "next/link";

type DocsLinkProps = React.ComponentProps<typeof Link>;

export function DocsLink({ children, className, ...props }: DocsLinkProps) {
  return (
    <Link
      {...props}
      target="_blank"
      className={cn(className, "inline-flex items-center gap-1 text-orange-600")}
    >
      {children} <LucideLink size="13" />
    </Link>
  );
}

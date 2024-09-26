import { cn } from "@/lib/utils";
import Link from "next/link";

type ExternalLinkProps = React.ComponentProps<typeof Link>;

export function ExternalLink({
  children,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        className,
        "underline flex items-center gap-1 hover:text-orange-500",
      )}
      target="_blank"
    >
      {children}
    </Link>
  );
}

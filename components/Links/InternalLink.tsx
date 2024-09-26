import { cn } from "@/lib/utils";
import Link from "next/link";

type InternalLinkProps = React.ComponentProps<typeof Link>;

export function InternalLink(props: InternalLinkProps) {
  return <Link {...props} className={cn(props.className, "hover:text-blue-500")} />;
}

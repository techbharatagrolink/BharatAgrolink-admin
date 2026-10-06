import Image from "next/image";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/** Full wordmark (3137×997) or the leaf icon (square). */
export function BrandLogo({ variant = "full", className, priority = false }) {
  if (variant === "icon") {
    return <Image src="/brand/logo-icon.png" alt={site.name} width={64} height={64} priority={priority} className={cn("size-8 object-contain", className)} />;
  }
  return <Image src="/brand/logo-full.png" alt={site.name} width={315} height={100} priority={priority} className={cn("h-9 w-auto object-contain", className)} />;
}

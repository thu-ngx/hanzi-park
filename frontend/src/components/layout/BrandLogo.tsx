import { Link } from "react-router";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
};

const BrandLogo = ({ className }: BrandLogoProps) => (
  <Link to="/" className={cn("flex items-center gap-2 shrink-0", className)}>
    <span className="text-2xl font-bold text-primary">字</span>
    <span className="text-md md:text-lg text-primary font-semibold">
      Hanzi Park
    </span>
  </Link>
);

export default BrandLogo;

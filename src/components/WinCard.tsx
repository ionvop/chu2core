import type { ReactNode } from "react";
import { Frame, TitleBar } from "@react95/core";

interface WinCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  active?: boolean;
}

/**
 * A candy-pastel Windows-95-style window used as a content card. Uses React95's
 * Frame + TitleBar with the theme we recolored pink. Kept minimal per the plan.
 */
export function WinCard({
  title,
  icon,
  children,
  className = "",
  active = true,
}: WinCardProps) {
  return (
    <Frame
      className={`soft-shadow bg-blush/60 backdrop-blur-sm ${className}`}
      boxShadow="out"
      padding={3}
    >
      <TitleBar title={title} icon={icon} active={active} className="items-center" />
      <div className="px-4 py-5">{children}</div>
    </Frame>
  );
}
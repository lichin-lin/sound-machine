import React from "react";

interface BentoBoxProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  gridArea?: string;
  onClick?: () => void;
  label?: string;
}

export function BentoBox({
  children,
  className = "",
  active = false,
  gridArea,
  onClick,
  label,
}: BentoBoxProps) {
  const style = gridArea ? { gridArea } : {};

  return (
    <div
      className={`bento-item ${active ? "active" : ""} ${className}`}
      style={style}
      onClick={onClick}
    >
      {label && <div className="bento-label">{label}</div>}
      <div className="bento-content">{children}</div>
    </div>
  );
}
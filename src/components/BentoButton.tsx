import React from "react";
import { Play, Pause, Square } from "lucide-react";

interface BentoButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "active" | "muted" | "brand";
}

export function BentoButton({
  children,
  active = false,
  onClick,
  className = "",
  variant = "default",
}: BentoButtonProps) {
  const getVariantStyles = () => {
    if (variant === "brand") {
      return active
        ? "bg-[#FD4D2A] text-white border-[#FD4D2A] shadow-[0_0_8px_rgba(253,77,42,0.3)]"
        : "bg-[#FD4D2A] text-white border-[#FD4D2A] hover:bg-[#E63E1F] hover:shadow-[0_0_8px_rgba(253,77,42,0.3)]";
    }
    if (active || variant === "active") {
      return "bg-[#131313] text-[#D0D0D0] border-[#131313]";
    }
    if (variant === "muted") {
      return "bg-[#B8B8B8] text-[#131313] border-[#BEBEBE]";
    }
    return "bg-[#D0D0D0] text-[#131313] border-[#BEBEBE] hover:bg-[#B8B8B8]";
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${getVariantStyles()}
        border px-1 py-1 lg:px-3 lg:py-2 
        transition-colors duration-150
        font-medium text-sm
        min-h-[28px] lg:min-h-[32px]
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {typeof children === "string" &&
          children === "PLAY" && (
            <Play
              className="hidden md:block"
              fill={"#fff"}
              size={14}
            />
          )}
        {typeof children === "string" &&
          children === "STOP" && (
            <Square
              className="hidden md:block"
              fill={"#fff"}
              size={14}
            />
          )}
        {children}
      </div>
    </button>
  );
}
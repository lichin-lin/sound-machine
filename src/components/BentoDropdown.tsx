import React, { useState } from "react";

interface BentoDropdownProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function BentoDropdown({
  options,
  value,
  onValueChange,
  className = "",
}: BentoDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 lg:px-3 lg:py-2  bg-[#D0D0D0] text-[#131313] border border-[#BEBEBE] text-left flex items-center justify-between hover:bg-[#B8B8B8] transition-colors"
      >
        <span className="text-sm truncate pr-2 flex-1 text-left">
          {value}
        </span>
        <span className="text-[10px] md:text-xs flex-shrink-0">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-250 bg-[#D0D0D0] border border-[#BEBEBE] border-t-0">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onValueChange(option);
                setIsOpen(false);
              }}
              className="w-full px-2 py-1 lg:px-3 lg:py-2  text-left text-sm hover:bg-[#B8B8B8] transition-colors border-b border-[#BEBEBE] last:border-b-0 truncate"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
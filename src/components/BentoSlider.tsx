import React, { useCallback, useState, useRef } from "react";

interface BentoSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function BentoSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
  orientation = "horizontal",
}: BentoSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentValue = value[0] || min;

  const updateValue = useCallback(
    (clientPosition: number) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      let percentage: number;

      if (orientation === "vertical") {
        percentage =
          1 - (clientPosition - rect.top) / rect.height;
      } else {
        percentage = (clientPosition - rect.left) / rect.width;
      }

      percentage = Math.max(0, Math.min(1, percentage));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(
        min,
        Math.min(max, steppedValue),
      );

      onValueChange([clampedValue]);
    },
    [min, max, step, onValueChange, orientation],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);

      updateValue(
        orientation === "vertical" ? e.clientY : e.clientX,
      );

      const handleMouseMove = (e: MouseEvent) => {
        updateValue(
          orientation === "vertical" ? e.clientY : e.clientX,
        );
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener(
          "mousemove",
          handleMouseMove,
        );
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateValue, orientation],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsTouching(true);
      setIsDragging(true);

      const touch = e.touches[0];
      updateValue(
        orientation === "vertical"
          ? touch.clientY
          : touch.clientX,
      );

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        updateValue(
          orientation === "vertical"
            ? touch.clientY
            : touch.clientX,
        );
      };

      const handleTouchEnd = (e: TouchEvent) => {
        e.preventDefault();
        setIsTouching(false);
        setIsDragging(false);
        document.removeEventListener(
          "touchmove",
          handleTouchMove,
        );
        document.removeEventListener(
          "touchend",
          handleTouchEnd,
        );
      };

      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });
    },
    [updateValue, orientation],
  );

  // Calculate thumb position based on current value
  const percentage = (currentValue - min) / (max - min);

  const trackClass =
    orientation === "vertical"
      ? "w-2 h-full bg-[#BEBEBE] border border-[#BEBEBE]"
      : "w-full h-2 bg-[#BEBEBE] border border-[#BEBEBE]";

  // Enhanced thumb with larger touch target and active state
  const thumbClass =
    orientation === "vertical"
      ? `w-3 h-6 bg-[#131313] border border-[#BEBEBE] absolute cursor-pointer 
         md:w-3 md:h-6 select-none touch-manipulation
         transition-all duration-100 ease-out`
      : `w-3 h-6 bg-[#131313] border border-[#BEBEBE] absolute cursor-pointer
         md:w-3 md:h-6 select-none touch-manipulation
         transition-all duration-100 ease-out`;

  const thumbStyle =
    orientation === "vertical"
      ? {
          bottom: `calc(${percentage * 100}% - 12px)`,
          left: "-6px",
          transform:
            isDragging || isTouching
              ? "scale(1.05)"
              : "scale(1)",
        }
      : {
          left: `calc(${percentage * 100}% - 8px)`,
          top: "-4px",
          transform:
            isDragging || isTouching
              ? "scale(1.05)"
              : "scale(1)",
        };

  // Enhanced container with larger touch target
  const containerClass =
    orientation === "vertical"
      ? "relative h-full w-4 flex justify-center touch-manipulation"
      : "relative w-full h-4 flex items-center touch-manipulation";

  return (
    <div
      className={`${containerClass} ${className}`}
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ touchAction: "none" }} // Prevent scrolling while dragging
    >
      <div className={trackClass} />
      <div
        className={thumbClass}
        style={thumbStyle}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        tabIndex={0}
      />
    </div>
  );
}
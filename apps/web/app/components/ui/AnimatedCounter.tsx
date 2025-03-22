"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  formatValue?: (value: number) => string;
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className = "",
  formatValue = (value) => value.toLocaleString(),
}: AnimatedCounterProps) {
  // Create motion value
  const count = useMotionValue(from);
  
  // Transform the motion value to apply rounding
  const rounded = useTransform(count, (latest) => formatValue(Math.round(latest)));
  
  // Create color animation based on count progress
  const progress = useTransform(
    count, 
    [from, to], 
    [0, 1]
  );
  
  // Transform progress to color
  const color = useTransform(
    progress,
    [0, 0.5, 1],
    ["#0ea5e9", "#38bdf8", "#64748b"]
  );

  // Run the animation when the component mounts or when "to" prop changes
  useEffect(() => {
    // Animate from the current value to the target value
    const animation = animate(count, to, { 
      duration,
      // Use a slight easing for more natural animation
      ease: "easeOut"
    });
    
    // Clean up animation on unmount
    return animation.stop;
  }, [count, to, duration]);

  return (
    <motion.span 
      className={className}
      style={{ color }}
    >
      {rounded}
    </motion.span>
  );
} 
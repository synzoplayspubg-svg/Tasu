import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

interface ScrollBlurRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export default function ScrollBlurReveal({
  text,
  className = "",
  as: Component = "span",
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
  once = true,
}: ScrollBlurRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once, margin: "-12% 0px" });

  return (
    <Component ref={containerRef} className={`${className} block overflow-hidden`}>
      <motion.span
        initial={{ opacity: 0, filter: "blur(10px)", y: 15 }}
        animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(10px)", y: 15 }}
        transition={{
          duration: duration,
          delay: delay,
          ease: [0.16, 1, 0.3, 1], // Cinematic smooth modern ease out
        }}
        className="block"
      >
        {text}
      </motion.span>
    </Component>
  );
}

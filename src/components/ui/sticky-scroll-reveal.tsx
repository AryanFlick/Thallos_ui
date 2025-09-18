"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import ShinyText from "@/components/ShinyText";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = content.length;

  // Add state to track scroll direction and improve timing
  const [lastScrollProgress, setLastScrollProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Track scroll direction
    const direction = latest > lastScrollProgress ? 'down' : 'up';
    setLastScrollProgress(latest);

    // Calculate which card should be active based on scroll progress
    const progress = Math.max(0, Math.min(1, latest));
    
    // More conservative timing to ensure text is visible before image switches
    let adjustedProgress;
    if (direction === 'down') {
      // When scrolling down, wait longer before switching
      adjustedProgress = Math.max(0, (progress - 0.2) * 1.25);
    } else {
      // When scrolling up, also wait to ensure text is visible
      adjustedProgress = Math.max(0, (progress - 0.15) * 1.2);
    }
    
    const cardIndex = Math.min(cardLength - 1, Math.max(0, Math.round(adjustedProgress * (cardLength - 1))));
    setActiveCard(cardIndex);
  });

  const backgroundColors = [
    "#000000", // black
    "#000000", // black
    "#000000", // black
  ];
  // Remove the gradient background changes - keep it consistent
  const [backgroundGradient] = useState("#000000");

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-screen justify-start space-x-16 overflow-y-auto rounded-md p-16 scroll-smooth"
      style={{
        backgroundImage: `
          linear-gradient(rgba(75, 85, 99, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-4xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="min-h-screen flex flex-col justify-center py-16">
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2,
                  y: activeCard === index ? 0 : 30,
                  scale: activeCard === index ? 1 : 0.95,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.2,
                  y: activeCard === index ? 0 : 20,
                  scale: activeCard === index ? 1 : 0.98,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                }}
                className="text-lg sm:text-xl lg:text-2xl leading-relaxed mt-6 max-w-2xl font-light"
              >
                {activeCard === index ? (
                  <ShinyText 
                    text={item.description} 
                    className="text-slate-300" 
                    speed={3}
                  />
                ) : (
                  <span className="text-slate-300">{item.description}</span>
                )}
              </motion.div>
            </div>
          ))}
          <div className="h-32" />
        </div>
      </div>
      <div
        style={{ backgroundColor: backgroundGradient }}
        className={cn(
          "sticky top-10 hidden h-96 w-[32rem] overflow-hidden rounded-xl bg-black lg:block shadow-2xl",
          contentClassName,
        )}
      >
        <motion.div
          key={activeCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full w-full"
        >
          {content[activeCard].content ?? null}
        </motion.div>
      </div>
    </motion.div>
  );
};

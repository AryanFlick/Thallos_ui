'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  text?: string;
  totalBoxes?: number;
  showTyping?: boolean;
  typeSpeedMsPerChar?: number;
  className?: string;           // outer container classes
  backgroundClass?: string;     // e.g. 'bg-black'
  boxColorClass?: string;       // e.g. 'bg-gray-800'
  textClassName?: string;       // text gradient + sizing
};

export default function BoxSplitAnimation({
  text = 'THALLOS CAPITAL',
  totalBoxes = 18,
  showTyping = true,
  typeSpeedMsPerChar = 100,
  className = '',
  backgroundClass = 'bg-black',
  boxColorClass = 'bg-gradient-to-t from-purple-900/60 to-purple-800/40',
  textClassName = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 animate-shimmer tracking-wider relative text-6xl sm:text-8xl md:text-9xl lg:text-[10rem]',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [inView, setInView] = useState(false);
  const [lineComplete, setLineComplete] = useState(false);
  const [dupStep, setDupStep] = useState<'hidden' | 'slid' | 'risen'>('hidden');
  const [showText, setShowText] = useState(false);
  const [typed, setTyped] = useState('');

  // timings
  const drawDuration = 0.4;
  const riseDuration = 0.3;
  const slideDuration = 0.25;
  const riseDelay = 400;
  const slideDelay = riseDelay + riseDuration * 1000;
  const dupRiseDelay = slideDelay + slideDuration * 1000;
  const textDelay = dupRiseDelay + 300;

  // Observe visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setTimeout(() => setLineComplete(true), riseDelay);
        } else {
          // reset so it can play again when re-entering
          setInView(false);
          setLineComplete(false);
          setDupStep('hidden');
          setShowText(false);
          setTyped('');
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // sequence: slide dup → rise dup → show text
  useEffect(() => {
    if (!lineComplete) return;
    const t1 = setTimeout(() => setDupStep('slid'), slideDelay);
    const t2 = setTimeout(() => setDupStep('risen'), dupRiseDelay);
    const t3 = setTimeout(() => setShowText(true), textDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [lineComplete, slideDelay, dupRiseDelay, textDelay]);

  // typing effect
  useEffect(() => {
    if (!showText) return;
    if (!showTyping) {
      setTyped(text);
      return;
    }
    let i = 0;
    setTyped('');
    const tick = () => {
      i++;
      setTyped(text.slice(0, i));
      if (i < text.length) setTimeout(tick, typeSpeedMsPerChar);
    };
    setTimeout(tick, typeSpeedMsPerChar);
  }, [showText, showTyping, text, typeSpeedMsPerChar]);

  const boxes = Array.from({ length: totalBoxes }, (_, i) => ({
    id: i,
    shouldRise: i % 2 === 1,
  }));
  const oneBoxPct = 100 / totalBoxes;

  // variants
  const lineVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -80, scale: 0.95 },
  };

  const boxVariants = {
    initial: { y: 0 },
    rise: (shouldRise: boolean) => ({
      y: shouldRise ? '-100%' : 0,
    }),
  };

  const dupVariants = {
    hidden: { x: '0%', y: '-100%', opacity: 0 },
    slid: { x: `-${oneBoxPct}%`, y: '-100%', opacity: 1 },
    risen: { x: `-${oneBoxPct}%`, y: '-200%', opacity: 1 },
  };

  // height scales with box count; square boxes stacked 1.8x the box size for more compact layout
  const heightStyle = {
    height: `calc(1.8 * min(calc((90vw - 2rem) / ${totalBoxes}), calc((95vw - 2rem) / ${totalBoxes})))`,
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${backgroundClass} ${className}`} style={heightStyle}>
      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <AnimatePresence>
          {showText && (
            <motion.h2 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className={textClassName} 
              style={{ backgroundSize: '200% 100%', transform: 'translateY(-0.5rem)' }}
            >
              {typed}
              <span className="animate-pulse">|</span>
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* Base row */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <AnimatePresence>
          {inView && (
            <motion.div
              className="flex w-[90%] sm:w-[95%] md:w-[98%] mx-auto"
              variants={lineVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: drawDuration, ease: "easeOut" }}
              style={{ gap: 0 }}
            >
              {boxes.map((b) => (
                <motion.div
                  key={b.id}
                  className={`aspect-square ${boxColorClass} border border-purple-800/20`}
                  variants={boxVariants}
                  custom={b.shouldRise}
                  animate={lineComplete ? 'rise' : 'initial'}
                  transition={{ duration: riseDuration, ease: "easeOut" }}
                  style={{ width: `${100 / totalBoxes}%` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Duplicates: slide into gaps then rise up */}
      <AnimatePresence>
        {lineComplete && (
          <motion.div
            className="absolute inset-x-0 bottom-0 flex w-[90%] sm:w-[95%] md:w-[98%] mx-auto"
            variants={dupVariants}
            initial="hidden"
            animate={dupStep}
            exit="hidden"
            transition={{ 
              duration: dupStep === 'slid' ? slideDuration : riseDuration, 
              ease: "easeOut" 
            }}
            style={{ gap: 0 }}
          >
            {boxes.map((b) =>
              b.shouldRise ? (
                <motion.div 
                  key={b.id} 
                  className={`aspect-square ${boxColorClass} border border-purple-800/20`} 
                  style={{ width: `${100 / totalBoxes}%` }} 
                />
              ) : (
                <motion.div 
                  key={b.id} 
                  className="aspect-square" 
                  style={{ width: `${100 / totalBoxes}%` }} 
                />
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

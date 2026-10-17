"use client";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
const spring = { stiffness: 260, damping: 22, mass: 0.65 };

export function Tilt({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateX.set(((event.clientY - rect.top) / rect.height - 0.5) * -5);
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 5);
  };
  return (
    <motion.div
      className={className}
      onPointerMove={move}
      onPointerLeave={reset}
      style={
        reduce ? undefined : { rotateX, rotateY, transformPerspective: 1000 }
      }
    >
      {children}
    </motion.div>
  );
}

export function MagneticLink({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  return (
    <motion.a
      href={href}
      className={className}
      style={reduce ? undefined : { x, y }}
      onPointerMove={(event) => {
        if (reduce || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.14);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      transition={spring}
    >
      {children}
    </motion.a>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Burst() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <span className="burst" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.i
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * 56,
              y: Math.sin(angle) * 48 - 12,
              opacity: 0,
              scale: 0,
              rotate: i * 65,
            }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

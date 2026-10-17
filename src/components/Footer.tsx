"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { Burst, Reveal } from "./ui/Motion";
export function Footer() {
  const [jumps, setJumps] = useState(0);
  const reduce = useReducedMotion();
  return (
    <footer className="site-footer wrap">
      <Reveal className="footer-main">
        <div>
          <h2>下个小世界见。</h2>
          <div className="footer-links">
            <a
              href="https://tja688.itch.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              itch.io <ArrowUpRightIcon size={16} aria-hidden="true" />
            </a>
            <a
              href="https://github.com/tja688"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub <ArrowUpRightIcon size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <button
          className="mascot-button"
          onClick={() => setJumps((n) => n + 1)}
          aria-label="和小卡带打个招呼"
        >
          <motion.img
            key={jumps}
            src="/media/site/cartridge.webp"
            alt=""
            width="144"
            height="144"
            loading="lazy"
            initial={false}
            animate={
              jumps && !reduce
                ? {
                    y: [0, 4, -40, 0, -9, 0],
                    rotate: [0, -8, 12, -5, 0],
                    scaleX: [1, 1.12, 0.94, 1.08, 1],
                  }
                : undefined
            }
            transition={{ duration: 0.68 }}
          />
          {jumps > 0 && <Burst key={`burst-${jumps}`} />}
        </button>
      </Reveal>
      <div className="footer-bottom">
        <span>小游档案</span>
        <a href="#" aria-label="回到起点">
          <ArrowUpIcon size={18} aria-hidden="true" />
        </a>
        <span>THANKS FOR PLAYING</span>
      </div>
    </footer>
  );
}

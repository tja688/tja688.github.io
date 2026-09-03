import { motion, type HTMLMotionProps } from 'motion/react';
import type { ReactNode } from 'react';

interface Props extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** 延迟（秒），用于同一屏内多个元素的错落 */
  delay?: number;
}

/** 进入视口时一次性的上浮显现；尊重系统减少动画设置（由 MotionConfig 统一处理） */
export function Reveal({ children, delay = 0, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

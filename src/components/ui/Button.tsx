import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'link';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background-color,color,border-color,transform] duration-300 ease-expo active:scale-[0.98]';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-bg px-5 py-2.5 hover:bg-white',
  ghost: 'border border-line-strong px-5 py-2.5 text-ink hover:border-ink hover:bg-surface',
  link: 'px-0 py-0 text-accent-ink hover:text-ink',
};

type CommonProps = { variant?: Variant; children: ReactNode; className?: string };

export function Button({
  variant = 'primary',
  children,
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className ?? ''}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = 'primary',
  children,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = rest.href?.startsWith('http');
  return (
    <a
      className={`${base} ${variants[variant]} ${className ?? ''}`}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

/** 箭头图标：所有「前往」类动作的统一符号 */
export function Arrow({ className, direction = 'right' }: { className?: string; direction?: 'right' | 'down' | 'up-right' }) {
  const rotate = direction === 'down' ? 90 : direction === 'up-right' ? -45 : 0;
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  value: string;
  /** 复制成功后的提示，默认「已复制」 */
  doneLabel?: string;
  /** 按钮自身的布局类；children 会被原样放进按钮里，最后再跟一个状态格 */
  className?: string;
  children?: ReactNode;
}

/**
 * 点一下把 value 写进剪贴板，末尾的复制图标短暂变成「已复制」。
 * 不支持 Clipboard API 时退回 execCommand。
 */
export function CopyField({ value, doneLabel = '已复制', className, children }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      return;
    } catch {
      /* 走下面的兼容路径 */
    }
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (ok) setCopied(true);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`group text-left ${className ?? 'inline-flex items-center gap-2'}`}
      title="点击复制"
    >
      {children ?? <span>{value}</span>}
      <span
        aria-live="polite"
        className={`inline-flex items-center justify-end font-mono text-[12px] transition-colors duration-200 ${
          copied ? 'text-accent-ink' : 'text-ink-faint group-hover:text-ink'
        }`}
      >
        {copied ? doneLabel : <CopyIcon />}
      </span>
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
    </svg>
  );
}

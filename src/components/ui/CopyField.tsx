import { useEffect, useState, type ReactNode } from "react";
import { CopyIcon, CheckIcon } from "@phosphor-icons/react";
interface Props {
  value: string;
  doneLabel?: string;
  className?: string;
  children?: ReactNode;
}
export function CopyField({
  value,
  doneLabel = "已复制",
  className,
  children,
}: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
      return;
    } catch {
      /* Try the browser's legacy clipboard API. */
    }
    const text = document.createElement("textarea");
    text.value = value;
    text.style.position = "fixed";
    text.style.opacity = "0";
    document.body.appendChild(text);
    text.select();
    try {
      setState(document.execCommand("copy") ? "copied" : "error");
    } catch {
      setState("error");
    } finally {
      text.remove();
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={className ?? "copy-code"}
      title="复制提取码"
    >
      {children ?? <span>{value}</span>}
      <span aria-live="polite">
        {state === "copied" ? (
          <span className="copy-feedback">
            <CheckIcon size={14} aria-hidden="true" />
            {doneLabel}
          </span>
        ) : state === "error" ? (
          "请手动复制"
        ) : (
          <CopyIcon size={14} aria-hidden="true" />
        )}
      </span>
    </button>
  );
}

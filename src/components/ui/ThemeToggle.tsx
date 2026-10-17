"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    document.documentElement.dataset.theme === "light"
      ? "light"
      : document.documentElement.dataset.theme === "dark"
        ? "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
  );
  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (!document.documentElement.dataset.theme)
        setTheme(preference.matches ? "dark" : "light");
    };
    preference.addEventListener("change", followSystem);
    return () => preference.removeEventListener("change", followSystem);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("archive-theme", next);
    } catch {
      /* Theme still works without storage. */
    }
  };
  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === "dark" ? "切换浅色模式" : "切换深色模式"}
    >
      {theme === "dark" ? (
        <SunIcon size={20} aria-hidden="true" />
      ) : (
        <MoonIcon size={20} aria-hidden="true" />
      )}
    </button>
  );
}

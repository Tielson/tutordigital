'use client'

import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(preferredTheme);
    document.documentElement.className = preferredTheme;
    document.documentElement.style.colorScheme = preferredTheme;
  }, []);

  return <>{children}</>;
}

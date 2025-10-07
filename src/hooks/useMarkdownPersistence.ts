import { useState, useEffect } from "react";

export const useMarkdownPersistence = (key: string, defaultValue: string) => {
  const [markdown, setMarkdown] = useState<string>(() => {
    return localStorage.getItem(key) || defaultValue;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(key, markdown);
    }, 300); // Debounced

    return () => clearTimeout(timeout);
  }, [markdown, key]);

  return [markdown, setMarkdown] as const;
};

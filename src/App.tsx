// src/App.jsx
import { useState, useEffect } from "react";
import { marked } from "marked";
import { Button } from "delightplus-ui";

import { useTheme } from "./context/ThemeContext";

marked.setOptions({
  breaks: true,
});

function App() {
  const { theme, toggleTheme } = useTheme();
  const [markdown, setMarkdown] = useState(() => {
    return (
      localStorage.getItem("markdown") || `# Hello Markdown!\n\nStart typing...`
    );
  });

  useEffect(() => {
  localStorage.setItem("markdown", markdown);
}, [markdown]);

  return (
    <div className="w-screen min-h-screen py-10 px-4 bg-[var(--bg)] text-[var(--text)] transition-colors">
      <div className="max-w-6xl mx-auto bg-[var(--bg)] text-[var(--text)] transition-colors shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Markdown Previewer</h1>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Markdown Input */}
          <textarea
            id="editor"
            className="w-full h-[70vh] p-4 bg-[var(--bg)] border border-[var(--border)] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[var(--border)]
 font-mono text-sm"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />

          {/* Markdown Preview */}
          <div
            id="preview"
            className="w-full h-[70vh] overflow-y-auto p-4 border border-[var(--border)] bg-[var(--bg)] rounded-md prose prose-sm md:prose-base lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(markdown) }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

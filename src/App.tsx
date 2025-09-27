// src/App.jsx
import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import { useTheme, Button, Card, CardContent, Textarea } from "delightplus-ui";

marked.setOptions({
  breaks: true,
});

function App() {
  const editorRef = useRef(null);
  const previewRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const [markdown, setMarkdown] = useState(() => {
    return (
      localStorage.getItem("markdown") || `# Hello Markdown!\n\nStart typing...`
    );
  });

  useEffect(() => {
    localStorage.setItem("markdown", markdown);
  }, [markdown]);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    const handleScroll = () => {
      const scrollRatio =
        editor.scrollTop / (editor.scrollHeight - editor.clientHeight);

      preview.scrollTop =
        scrollRatio * (preview.scrollHeight - preview.clientHeight);
    };

    editor.addEventListener("scroll", handleScroll);

    return () => editor.removeEventListener("scroll", handleScroll);
  }, []);

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
          <Textarea
            ref={editorRef}
            id="editor"
            variant="outlined"
            className="w-full h-[70vh] resize-none font-mono text-md"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />

          {/* Markdown Preview */}
          <Card variant="muted" className="h-[70vh] overflow-hidden">
            <CardContent
              ref={previewRef}
              id="preview"
              className="h-full overflow-y-auto prose prose-sm md:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(markdown) }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;

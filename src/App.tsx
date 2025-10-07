import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import {
  useTheme,
  Button,
  Card,
  CardContent,
  Container,
  Textarea,
} from "delightplus-ui";

marked.setOptions({
  breaks: true,
});

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const [markdown, setMarkdown] = useState<string>(() => {
    return (
      localStorage.getItem("markdown") || "# Hello Markdown!\n\nStart typing..."
    );
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("markdown", markdown);
    }, 300); // debounce delay

    return () => clearTimeout(timeout);
  }, [markdown]);

  const editorRef = useRef<HTMLTextAreaElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);

  const [editorWidth, setEditorWidth] = useState("50%");
  const isResizing = useRef(false);

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

  const startResizing = () => {
    isResizing.current = true;
  };

  const stopResizing = () => {
    isResizing.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !editorWrapperRef.current) return;

    const container = editorWrapperRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newWidth =
      ((e.clientX - containerRect.left) / containerRect.width) * 100;
    setEditorWidth(`${Math.max(20, Math.min(newWidth, 80))}%`);
  };

  const exportMarkdown = (type: "md" | "txt") => {
    const blob = new Blob([markdown], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `markdown.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  return (
    <div className="w-screen min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors flex flex-col">
      {/* Container will now handle internal spacing and layout */}
      <Container className="flex flex-col h-screen p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Markdown Previewer</h1>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => exportMarkdown("md")}>
              Export .md
            </Button>

            <span> | </span>

            <Button size="sm" onClick={() => exportMarkdown("txt")}>
              Export .txt
            </Button>

            <span> | </span>

            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Editor */}
          <div
            ref={editorWrapperRef}
            className="w-1/2 min-w-[150px] h-full"
            style={{ width: editorWidth, minWidth: "300px", maxWidth: "80%" }}
          >
            <Textarea
              aria-label="Markdown Editor"
              ref={editorRef}
              id="editor"
              variant="outlined"
              className="font-mono text-md resize-none"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* Draggable Divider */}
          <div
            className="w-2 mx-2 bg-[var(--border)] cursor-col-resize z-10  hover:bg-[var(--border-hover)]"
            tabIndex={0}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize Editor"
            onKeyDown={(e) => {
              const width = parseFloat(editorWidth);
              if (e.key === "ArrowLeft") {
                setEditorWidth(`${Math.max(20, width - 2)}%`);
              } else if (e.key === "ArrowRight") {
                setEditorWidth(`${Math.min(80, width + 2)}%`);
              }
            }}
            onMouseDown={startResizing}
          />

          {/* Markdown Preview */}
          <Card variant="muted" className="h-full overflow-hidden pt-3">
            <CardContent
              ref={previewRef}
              role="region"
              aria-label="Markdown Preview"
              id="preview"
              className="h-full overflow-y-auto prose prose-sm md:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: markdown.trim()
                  ? DOMPurify.sanitize(marked(markdown))
                  : "<p class='text-gray-400 italic'>Start typing markdown...</p>",
              }}
            />
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default App;

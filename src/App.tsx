import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
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
    localStorage.setItem("markdown", markdown);
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
          <Button
            variant="ghost"
            size="sm"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Editor */}
          <div
            ref={editorWrapperRef}
            className="w-1/2 min-w-[150px] h-full"
            style={{ width: editorWidth, minWidth: "300px", maxWidth: "80%", }}
          >
            <Textarea
              ref={editorRef}
              id="editor"
              variant="outlined"           
              className="font-mono text-md"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
            />
          </div>

          {/* Draggable Divider */}
          <div
            className="w-1 bg-[var(--border)] cursor-col-resize z-10 mx-3"
            onMouseDown={startResizing}
          />
          
          {/* Markdown Preview */}
          <Card variant="muted" className="h-full overflow-hidden pt-3">
            <CardContent
              ref={previewRef}
              id="preview"
              className="h-full overflow-y-auto prose prose-sm md:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: marked(markdown) }}
            />
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default App;

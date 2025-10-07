import { useRef, useState, useEffect } from "react";

export const useResizablePane = (
  initialWidthPercent: number = 50
): [string, React.RefObject<HTMLDivElement>] => {
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);
  const isResizing = useRef(false);
  const [editorWidth, setEditorWidth] = useState(`${initialWidthPercent}%`);

  const startResizing = () => (isResizing.current = true);
  const stopResizing = () => (isResizing.current = false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current || !editorWrapperRef.current) return;

    const container = editorWrapperRef.current.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
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

  return [editorWidth, editorWrapperRef, startResizing];
};

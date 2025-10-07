// MarkdownPreview.tsx
import { Card, CardContent } from "delightplus-ui";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface Props {
  markdown: string;
  previewRef: React.RefObject<HTMLDivElement>;
}

const MarkdownPreview = ({ markdown, previewRef }: Props) => {
  const html = DOMPurify.sanitize(marked(markdown));

  return (
    <Card variant="muted" className="h-full overflow-hidden pt-3" role="region" aria-label="Markdown Preview">
      <CardContent
        ref={previewRef}
        id="preview"
        className="h-full overflow-y-auto prose prose-sm md:prose-base lg:prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Card>
  );
};

export default MarkdownPreview;

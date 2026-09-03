import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface PreviewPaneProps {
  markdown: string
}

export function PreviewPane({ markdown }: PreviewPaneProps) {
  return (
    <div className="flex-1 overflow-y-auto min-h-0 p-6 prose prose-sm dark:prose-invert max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  )
}

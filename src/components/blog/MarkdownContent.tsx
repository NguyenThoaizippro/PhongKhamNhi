import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Render markdown content với prose styles dùng design tokens của brand.
 * Dùng cho blog post detail. Sanitize mặc định bởi react-markdown (không cho phép raw HTML).
 */
export function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-10 mb-3 text-2xl sm:text-3xl font-extrabold text-[color:var(--color-text)]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-2 text-xl font-bold text-[color:var(--color-text)]">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="my-4 text-base leading-7 text-[color:var(--color-text)]">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[color:var(--color-primary-dark)] underline underline-offset-2 hover:text-[color:var(--color-primary)]"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-4 ml-6 list-disc space-y-1.5 text-[color:var(--color-text)]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-4 ml-6 list-decimal space-y-1.5 text-[color:var(--color-text)]">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-4 border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)]/40 px-4 py-3 rounded-r-lg italic">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 rounded bg-[color:var(--color-primary-bg)] text-[color:var(--color-primary-dark)] text-sm font-mono">
              {children}
            </code>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-[color:var(--color-text)]">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-[color:var(--color-text-soft)] italic">{children}</em>
          ),
          hr: () => <hr className="my-8 border-[color:var(--color-border)]" />,
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[color:var(--color-primary-bg)] text-left">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold border-b border-[color:var(--color-border)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-[color:var(--color-border)]">{children}</td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

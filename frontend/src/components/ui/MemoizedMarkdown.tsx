// src/components/ui/MemoizedMarkdown.tsx
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 选用一个极客风的深色主题，比如 vscDarkPlus 或 atomDark
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MemoizedMarkdown = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 1. 代码块高亮逻辑
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
              customStyle={{ margin: '1em 0', borderRadius: '8px', background: '#1e1e1e' }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        // 2. 链接样式 (比如跳转到你的 Project 页面)
        a: ({ node, ...props }) => (
          <a {...props} className="text-blue-400 hover:underline cursor-pointer" target="_blank" rel="noopener noreferrer" />
        ),
        // 3. 列表样式
        ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside ml-4" />,
        ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside ml-4" />,
        // 4. 段落间距
        p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default MemoizedMarkdown;
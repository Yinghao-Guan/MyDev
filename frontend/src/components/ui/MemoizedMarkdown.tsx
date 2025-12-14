// src/components/ui/MemoizedMarkdown.tsx
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 选用一个极客风的深色主题
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MemoizedMarkdown = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // --- 1. 标题样式 (修复 Tailwind 重置问题) ---
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl md:text-3xl font-bold text-green-400 mt-8 mb-4 border-b border-gray-800 pb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl md:text-2xl font-bold text-green-300 mt-6 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg md:text-xl font-bold text-green-200 mt-4 mb-2" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-bold text-green-100/80 mt-3 mb-1 uppercase tracking-wider" {...props} />
        ),

        // --- 2. 文本修饰 ---
        p: ({ node, ...props }) => <p className="mb-3 leading-relaxed text-gray-300 last:mb-0" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-bold text-green-100" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-green-200/80" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-green-500/50 pl-4 py-1 my-4 italic text-gray-500 bg-gray-900/30 rounded-r" {...props} />
        ),

        // --- 3. 列表样式 ---
        ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1 text-gray-300" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1 text-gray-300" {...props} />,
        li: ({ node, ...props }) => <li className="pl-1" {...props} />,

        // --- 4. 链接 ---
        a: ({ node, ...props }) => (
          <a className="text-blue-400 hover:text-blue-300 hover:underline decoration-blue-400/30 underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
        ),

        // --- 5. 表格 ---
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4 border border-gray-800 rounded">
            <table className="w-full text-left text-sm" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => <thead className="bg-gray-900 text-gray-200" {...props} />,
        th: ({ node, ...props }) => <th className="px-4 py-2 border-b border-gray-800 font-bold" {...props} />,
        td: ({ node, ...props }) => <td className="px-4 py-2 border-b border-gray-800/50 text-gray-400" {...props} />,

        // --- 6. 代码块逻辑 ---
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const isMermaid = match && match[1] === 'mermaid';

          // 如果是 mermaid 代码块，暂时渲染为普通的文本块，避免报错
          // (稍后我们在 Step 2 处理内容替换)
          if (!inline && isMermaid) {
             return (
               <div className="my-4 p-4 border border-dashed border-gray-700 rounded bg-gray-900/50 text-gray-500 text-xs font-mono text-center">
                 [Complex Diagram: View in Desktop App or see text description below]
                 <div className="hidden">{children}</div>
               </div>
             );
          }

          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
              customStyle={{
                margin: '1.5em 0',
                borderRadius: '8px',
                background: '#111',
                border: '1px solid #333',
                fontSize: '0.9em'
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className="bg-gray-800 text-green-300 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-700" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';

export default MemoizedMarkdown;
"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  ArticlePage,
  CodeBlock,
  Callout,
  ArticleSection,
} from "@/components/ArticlePage";

export default function RenderingArticle() {
  const t = useTranslations();
  const locale = useLocale();
  const vi = locale === "vi";

  const sections: ArticleSection[] = [
    {
      id: "how-rendering-works",
      title: vi ? "React Render như thế nào?" : "How Does React Render?",
      content: (
        <>
          <p>
            {vi
              ? "React không thao tác DOM trực tiếp. Thay vào đó, nó dùng mô hình Virtual DOM: JSX → Virtual DOM → Diffing → Minimal DOM updates."
              : "React doesn't manipulate the DOM directly. Instead, it uses a Virtual DOM model: JSX → Virtual DOM → Diffing → Minimal DOM updates."}
          </p>
          <Callout type="info">
            {vi
              ? "Đây là lý do React nhanh: thay vì cập nhật toàn bộ DOM, nó chỉ cập nhật những phần thực sự thay đổi."
              : "This is why React is fast: instead of updating the entire DOM, it only updates the parts that actually changed."}
          </Callout>
        </>
      ),
    },
    {
      id: "virtual-dom",
      title: "Virtual DOM",
      content: (
        <>
          <p>
            {vi
              ? "Virtual DOM là một bản sao nhẹ của DOM thật, được biểu diễn dưới dạng JavaScript objects. Mỗi lần state thay đổi, React tạo một cây Virtual DOM mới."
              : "The Virtual DOM is a lightweight copy of the real DOM, represented as JavaScript objects. Each time state changes, React creates a new Virtual DOM tree."}
          </p>
          <CodeBlock
            language="tsx"
            code={`// JSX:
<div className="card">
  <h2>Hello</h2>
  <p>World</p>
</div>

// Becomes a Virtual DOM object:
{
  type: 'div',
  props: { className: 'card' },
  children: [
    { type: 'h2', props: {}, children: ['Hello'] },
    { type: 'p',  props: {}, children: ['World'] },
  ]
}`}
          />
        </>
      ),
    },
    {
      id: "reconciliation",
      title: vi ? "Reconciliation (So sánh)" : "Reconciliation (Diffing)",
      content: (
        <>
          <p>
            {vi
              ? "React so sánh Virtual DOM cũ và mới (diffing) để tìm ra thay đổi tối thiểu. Thuật toán này chạy trong O(n) nhờ hai giả định:"
              : "React compares the old and new Virtual DOM (diffing) to find the minimum changes. This algorithm runs in O(n) thanks to two assumptions:"}
          </p>
          <ul style={{ paddingLeft: "20px", margin: "12px 0", lineHeight: 2 }}>
            <li>
              {vi
                ? "Hai elements khác type → tạo cây mới"
                : "Two elements of different types → create a new tree"}
            </li>
            <li>
              {vi
                ? "Dùng key prop để nhận biết items trong list"
                : "Use key props to identify items in lists"}
            </li>
          </ul>
          <CodeBlock
            filename="List Keys"
            language="tsx"
            code={`// ❌ Bad: Using index as key
{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}

// ✅ Good: Using stable unique ID
{items.map(item => (
  <ListItem key={item.id} data={item} />
))}`}
          />
          <Callout type="warning">
            {vi
              ? "Không dùng index làm key khi list có thể thay đổi thứ tự, thêm/xóa items. Điều này gây bugs re-render sai."
              : "Don't use index as key when the list can reorder, add/remove items. This causes incorrect re-render bugs."}
          </Callout>
        </>
      ),
    },
    {
      id: "batching",
      title: vi ? "Batching Updates" : "Batching Updates",
      content: (
        <>
          <p>
            {vi
              ? "React 18+ tự động batch (gộp) nhiều state updates thành một lần re-render duy nhất. Điều này cải thiện hiệu suất đáng kể."
              : "React 18+ automatically batches multiple state updates into a single re-render. This significantly improves performance."}
          </p>
          <CodeBlock
            language="tsx"
            code={`function handleClick() {
  // React 18: both updates are batched → 1 re-render
  setCount(c => c + 1);
  setFlag(f => !f);
  // Component only re-renders ONCE here

  // Even in async code (new in React 18):
  fetch('/api/data').then(() => {
    setData(newData);
    setLoading(false);
    // Still batched → 1 re-render
  });
}`}
          />
        </>
      ),
    },
    {
      id: "performance",
      title: vi ? "Tối ưu hiệu suất" : "Performance Optimization",
      content: (
        <>
          <p>
            {vi
              ? "React cung cấp nhiều công cụ để tránh re-render không cần thiết:"
              : "React provides several tools to avoid unnecessary re-renders:"}
          </p>
          <CodeBlock
            filename="Optimization.tsx"
            language="tsx"
            code={`import { memo, useMemo, useCallback } from 'react';

// 1. React.memo — skip re-render if props unchanged
const ExpensiveList = memo(function ExpensiveList({ items }: { items: Item[] }) {
  return items.map(item => <Card key={item.id} {...item} />);
});

// 2. useMemo — cache computed values
function Dashboard({ orders }: { orders: Order[] }) {
  const total = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders] // only recompute when orders changes
  );
  return <span>Total: \${total}</span>;
}

// 3. useCallback — cache function references
function Parent() {
  const handleClick = useCallback((id: string) => {
    console.log('clicked', id);
  }, []); // stable reference

  return <Child onClick={handleClick} />;
}`}
          />
          <Callout type="tip">
            {vi
              ? "Đừng tối ưu sớm! Chỉ dùng memo/useMemo/useCallback khi bạn đo được vấn đề hiệu suất thực sự. React đã rất nhanh mặc định."
              : "Don't optimize prematurely! Only use memo/useMemo/useCallback when you measure a real performance issue. React is already fast by default."}
          </Callout>
        </>
      ),
    },
  ];

  return (
    <ArticlePage
      title={t("courses.react.lessons.rendering.title")}
      description={t("courses.react.lessons.rendering.description")}
      sections={sections}
      vizUrl={`/${locale}/learn/react/rendering`}
      vizLabel={t("common.goToViz")}
      tocLabel={t("common.tableOfContents")}
    />
  );
}

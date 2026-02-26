import { mutation } from "./_generated/server";

export const seedComponentBasics = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("walkthroughs")
      .withIndex("by_course_slug", (q) =>
        q.eq("courseSlug", "react").eq("slug", "component-basics")
      )
      .unique();
    if (existing) {
      // Delete old data for re-seed
      const oldChapters = await ctx.db
        .query("chapters")
        .withIndex("by_walkthrough", (q) => q.eq("walkthroughId", existing._id))
        .collect();
      for (const ch of oldChapters) await ctx.db.delete(ch._id);
      await ctx.db.delete(existing._id);
    }

    const walkthroughId = await ctx.db.insert("walkthroughs", {
      slug: "component-basics",
      courseSlug: "react",
      title_en: "Component Basics",
      title_vi: "Cơ bản về Component",
      description_en:
        "Master the building blocks of React: components, JSX, props, state, and composition patterns.",
      description_vi:
        "Nắm vững các khối xây dựng của React: components, JSX, props, state, và các pattern kết hợp.",
      order: 0,
    });

    // ── Chapters as Markdown ──
    const chapters = [
      {
        order: 0,
        title_en: "What is a Component?",
        title_vi: "Component là gì?",
        content_en: `In React, everything you see on screen is a **component**. A component is a JavaScript function that returns JSX — an HTML-like syntax that describes what the UI should look like.

\`\`\`tsx
// Button.tsx
function Button({ label }: { label: string }) {
  return (
    <button className="btn-primary">
      {label}
    </button>
  );
}
\`\`\`

> 💡 **Info:** Components always start with an **UPPERCASE** letter. React uses this to distinguish components from regular HTML elements.`,
        content_vi: `Trong React, mọi thứ bạn thấy trên màn hình đều là **component**. Component là một hàm JavaScript trả về JSX — một cú pháp giống HTML mô tả giao diện.

\`\`\`tsx
// Button.tsx
function Button({ label }: { label: string }) {
  return (
    <button className="btn-primary">
      {label}
    </button>
  );
}
\`\`\`

> 💡 **Lưu ý:** Component luôn bắt đầu bằng chữ **IN HOA**. React dùng điều này để phân biệt component với HTML element thường.`,
        vizConfig: {
          nodes: [
            {
              id: "component",
              label: "Component",
              x: 0,
              y: 5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "function",
              label: "JS Function",
              x: -3.5,
              y: 3,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "jsx_return",
              label: "Returns JSX",
              x: 3.5,
              y: 3,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "button",
              label: "Button",
              x: -5,
              y: 1,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "props",
              label: "Props { label }",
              x: -1.5,
              y: 1,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "html_tag",
              label: "<button>",
              x: 2,
              y: 1,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "classname",
              label: "className",
              x: 5.5,
              y: 1,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "uppercase",
              label: "UPPERCASE ✓",
              x: 0,
              y: -1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 0, toIndex: 2 },
            { fromIndex: 1, toIndex: 3 },
            { fromIndex: 1, toIndex: 4 },
            { fromIndex: 2, toIndex: 5 },
            { fromIndex: 2, toIndex: 6 },
            { fromIndex: 3, toIndex: 7 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
      {
        order: 1,
        title_en: "The Component Tree",
        title_vi: "Cây Component",
        content_en: `Every React app is a **tree of components**. The root component (usually \`App\`) contains child components, and each child can contain grandchildren.

\`\`\`tsx
// App.tsx
function App() {
  return (
    <div>
      <Header />
      <Main>
        <ProductList />
        <Sidebar />
      </Main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <Nav />
      <Logo />
    </header>
  );
}
\`\`\`

This tree structure determines how data flows in the app — always from **parent to child** through props.`,
        content_vi: `Mỗi ứng dụng React là một **cây component**. Component gốc (thường là \`App\`) chứa các component con, mỗi component con lại có thể chứa component cháu.

\`\`\`tsx
// App.tsx
function App() {
  return (
    <div>
      <Header />
      <Main>
        <ProductList />
        <Sidebar />
      </Main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <Nav />
      <Logo />
    </header>
  );
}
\`\`\`

Cấu trúc cây này quyết định cách dữ liệu chảy trong ứng dụng — luôn từ **cha xuống con** thông qua props.`,
        vizConfig: {
          nodes: [
            {
              id: "app",
              label: "App (Root)",
              x: 0,
              y: 5.5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "header",
              label: "Header",
              x: -7,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "main",
              label: "Main",
              x: 0,
              y: 3.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "footer",
              label: "Footer",
              x: 7,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "nav",
              label: "Nav",
              x: -9.5,
              y: 1.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "logo",
              label: "Logo",
              x: -4.5,
              y: 1.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "productList",
              label: "ProductList",
              x: -1.5,
              y: 1.5,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "sidebar",
              label: "Sidebar",
              x: 1.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "data_flow",
              label: "Props ↓ Data Flow",
              x: 0,
              y: -1.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 0, toIndex: 2 },
            { fromIndex: 0, toIndex: 3 },
            { fromIndex: 1, toIndex: 4 },
            { fromIndex: 1, toIndex: 5 },
            { fromIndex: 2, toIndex: 6 },
            { fromIndex: 2, toIndex: 7 },
            { fromIndex: 6, toIndex: 8 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
      {
        order: 2,
        title_en: "JSX",
        title_vi: "JSX",
        content_en: `JSX looks like HTML but is actually JavaScript. The compiler (Babel/SWC) transforms JSX into \`React.createElement()\` calls.

\`\`\`tsx
// What you write (JSX):
const element = <h1 className="title">Hello</h1>;

// What the compiler produces:
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello'
);
\`\`\`

> ✅ **Tip:** In JSX, use \`className\` instead of \`class\`, \`htmlFor\` instead of \`for\`, since these are reserved words in JavaScript.

JSX lets you embed JavaScript expressions using curly braces \`{}\`:

\`\`\`tsx
function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  return (
    <div>
      <h2>{hour < 12 ? 'Good morning' : 'Good evening'}, {name}!</h2>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}
\`\`\``,
        content_vi: `JSX trông giống HTML nhưng thực chất là JavaScript. Trình biên dịch (Babel/SWC) chuyển JSX thành các lời gọi \`React.createElement()\`.

\`\`\`tsx
// Bạn viết (JSX):
const element = <h1 className="title">Hello</h1>;

// Compiler tạo ra:
const element = React.createElement(
  'h1',
  { className: 'title' },
  'Hello'
);
\`\`\`

> ✅ **Mẹo:** Trong JSX, dùng \`className\` thay vì \`class\`, \`htmlFor\` thay vì \`for\`, vì chúng là reserved words trong JavaScript.

JSX cho phép nhúng biểu thức JavaScript bằng dấu ngoặc nhọn \`{}\`:

\`\`\`tsx
function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  return (
    <div>
      <h2>{hour < 12 ? 'Good morning' : 'Good evening'}, {name}!</h2>
      <p>Today is {new Date().toLocaleDateString()}</p>
    </div>
  );
}
\`\`\``,
        vizConfig: {
          nodes: [
            {
              id: "jsx",
              label: "JSX Code",
              x: -4,
              y: 5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "compiler",
              label: "Babel / SWC",
              x: 0,
              y: 5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "createElement",
              label: "React.createElement()",
              x: 4,
              y: 5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "h1",
              label: "<h1>",
              x: -5,
              y: 3,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "className",
              label: "className",
              x: -1.75,
              y: 3,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "htmlFor",
              label: "htmlFor",
              x: 1.75,
              y: 3,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "curly",
              label: "{ } Expressions",
              x: 5,
              y: 3,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "greeting",
              label: "Greeting()",
              x: -2.5,
              y: 1,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "ternary",
              label: "Ternary ? :",
              x: 1,
              y: 1,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "date",
              label: "new Date()",
              x: 4.5,
              y: 1,
              color: "#10b981",
              glowColor: "#10b981",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 },
            { fromIndex: 0, toIndex: 3 },
            { fromIndex: 0, toIndex: 4 },
            { fromIndex: 0, toIndex: 5 },
            { fromIndex: 0, toIndex: 6 },
            { fromIndex: 6, toIndex: 7 },
            { fromIndex: 7, toIndex: 8 },
            { fromIndex: 7, toIndex: 9 },
          ],
          cameraPosition: [0, 2, 16],
        },
      },
      {
        order: 3,
        title_en: "Props — Passing Data",
        title_vi: "Props — Truyền dữ liệu",
        content_en: `Props (properties) are how a parent component passes data to its children. Props are **read-only** — a child cannot modify the props it receives.

\`\`\`tsx
// ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <span>\${price.toFixed(2)}</span>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}
\`\`\`

> ⚠️ **Warning:** Never mutate props! If you need to change data, use state inside the component.

React has a special prop: **children**. It lets you nest JSX inside a component like HTML:

\`\`\`tsx
// Card.tsx
function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage:
<Card title="User Profile">
  <Avatar src="/user.jpg" />
  <p>John Doe</p>
  <p>john@example.com</p>
</Card>
\`\`\``,
        content_vi: `Props (properties) là cách component cha truyền dữ liệu xuống component con. Props là **read-only** — con không thể thay đổi props nhận được.

\`\`\`tsx
// ProductCard.tsx
interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

function ProductCard({ name, price, image, onAddToCart }: ProductCardProps) {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <span>\${price.toFixed(2)}</span>
      <button onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}
\`\`\`

> ⚠️ **Cảnh báo:** Không bao giờ mutate props! Nếu bạn cần thay đổi dữ liệu, hãy dùng state trong component.

React có một prop đặc biệt: **children**. Nó cho phép bạn lồng JSX bên trong component giống HTML:

\`\`\`tsx
// Card.tsx
function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Sử dụng:
<Card title="User Profile">
  <Avatar src="/user.jpg" />
  <p>John Doe</p>
  <p>john@example.com</p>
</Card>
\`\`\``,
        vizConfig: {
          nodes: [
            {
              id: "parent",
              label: "Parent Component",
              x: 0,
              y: 5.5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "props_data",
              label: "Props { name, price }",
              x: 0,
              y: 3.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "product_card",
              label: "ProductCard",
              x: 0,
              y: 1.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "name_display",
              label: "<h3>{name}</h3>",
              x: -3.5,
              y: -1,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "price_display",
              label: "<span>{price}</span>",
              x: 0,
              y: -1,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "children_prop",
              label: "children prop",
              x: 3.5,
              y: -1,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 },
            { fromIndex: 2, toIndex: 3 },
            { fromIndex: 2, toIndex: 4 },
            { fromIndex: 2, toIndex: 5 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
      {
        order: 4,
        title_en: "State — Dynamic Data",
        title_vi: "State — Dữ liệu thay đổi",
        content_en: `State is component data that can **change over time**. When state changes, React automatically re-renders the component.

\`\`\`tsx
// Counter.tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

| | Props | State |
|---|---|---|
| **Who owns it?** | Parent component | The component itself |
| **Mutable?** | ❌ No | ✅ Yes (via setter) |
| **On change?** | Re-renders child | Re-renders itself |
| **When to use?** | Config, passed data | Interactive data |`,
        content_vi: `State là dữ liệu của component có thể **thay đổi theo thời gian**. Khi state thay đổi, React tự động re-render component.

\`\`\`tsx
// Counter.tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

| | Props | State |
|---|---|---|
| **Ai sở hữu?** | Component cha | Chính component |
| **Thay đổi được?** | ❌ Không | ✅ Có (qua setter) |
| **Khi thay đổi?** | Re-render con | Re-render chính nó |
| **Khi nào dùng?** | Config, data truyền | Data tương tác |`,
        vizConfig: {
          nodes: [
            {
              id: "counter",
              label: "Counter Component",
              x: 0,
              y: 5.5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "use_state",
              label: "useState(0)",
              x: -4.5,
              y: 3.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "state_val",
              label: "count (Value)",
              x: -2.75,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "state_setter",
              label: "setCount (Setter)",
              x: -6.25,
              y: 1.5,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "ui_p",
              label: "<p>{count}</p>",
              x: 3,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "btn_inc",
              label: "button +1",
              x: 1.5,
              y: 1.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "btn_dec",
              label: "button -1",
              x: 4.5,
              y: 1.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "re_render",
              label: "Auto Re-render ↺",
              x: 0,
              y: -1,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 },
            { fromIndex: 1, toIndex: 3 },
            { fromIndex: 0, toIndex: 4 },
            { fromIndex: 4, toIndex: 5 },
            { fromIndex: 4, toIndex: 6 },
            { fromIndex: 2, toIndex: 7 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
      {
        order: 5,
        title_en: "Conditional Rendering",
        title_vi: "Render có điều kiện",
        content_en: `React lets you show different UI based on conditions — using **if/else**, **ternary operator**, or the **&& operator**.

\`\`\`tsx
// LoginStatus.tsx
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <UserDashboard />
      ) : (
        <LoginForm />
      )}

      {/* && operator */}
      {isLoggedIn && <LogoutButton />}

      {!isLoggedIn && <p>Please sign in to continue.</p>}
    </div>
  );
}
\`\`\``,
        content_vi: `React cho phép hiển thị UI khác nhau dựa trên điều kiện — sử dụng **if/else**, **toán tử ba ngôi**, hoặc **toán tử &&**.

\`\`\`tsx
// LoginStatus.tsx
function LoginStatus({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div>
      {isLoggedIn ? (
        <UserDashboard />
      ) : (
        <LoginForm />
      )}

      {/* toán tử && */}
      {isLoggedIn && <LogoutButton />}

      {!isLoggedIn && <p>Vui lòng đăng nhập để tiếp tục.</p>}
    </div>
  );
}
\`\`\``,
        vizConfig: {
          nodes: [
            {
              id: "login_status",
              label: "LoginStatus",
              x: 0,
              y: 5.5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "condition",
              label: "isLoggedIn ?",
              x: 0,
              y: 3.5,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
            {
              id: "dash",
              label: "UserDashboard ✅",
              x: -3.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "form",
              label: "LoginForm ❌",
              x: 3.5,
              y: 1.5,
              color: "#EC4899",
              glowColor: "#EC4899",
            },
            {
              id: "and_op",
              label: "&& Operator",
              x: -4.5,
              y: -0.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "logout",
              label: "LogoutButton",
              x: -4.5,
              y: -2.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 1, toIndex: 2 },
            { fromIndex: 1, toIndex: 3 },
            { fromIndex: 2, toIndex: 4 },
            { fromIndex: 4, toIndex: 5 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
      {
        order: 6,
        title_en: "Composition Pattern",
        title_vi: "Composition Pattern",
        content_en: `Composition is the pattern of building complex UI by **combining simple components**. Instead of inheritance, React favors composition.

\`\`\`tsx
// ❌ Bad: One giant monolithic component
function Page() {
  return (
    <div>
      <nav>...</nav>
      <aside>...</aside>
      <main><section>...</section></main>
      <footer>...</footer>
    </div>
  );
}

// ✅ Good: Composed from focused components
function Page() {
  return (
    <Layout>
      <Header>
        <Nav items={menuItems} />
        <Logo />
      </Header>
      <Main>
        <ProductList products={products} />
        <Sidebar filters={filters} />
      </Main>
      <Footer links={footerLinks} />
    </Layout>
  );
}
\`\`\`

> ✅ **Tip:** Each component should do **ONE thing** well. If a component gets too big, break it into smaller, focused components.`,
        content_vi: `Composition là pattern xây dựng UI phức tạp bằng cách **kết hợp các component đơn giản**. Thay vì kế thừa (inheritance), React ưu tiên composition.

\`\`\`tsx
// ❌ Xấu: Một component khổng lồ
function Page() {
  return (
    <div>
      <nav>...</nav>
      <aside>...</aside>
      <main><section>...</section></main>
      <footer>...</footer>
    </div>
  );
}

// ✅ Tốt: Kết hợp từ các component nhỏ
function Page() {
  return (
    <Layout>
      <Header>
        <Nav items={menuItems} />
        <Logo />
      </Header>
      <Main>
        <ProductList products={products} />
        <Sidebar filters={filters} />
      </Main>
      <Footer links={footerLinks} />
    </Layout>
  );
}
\`\`\`

> ✅ **Mẹo:** Mỗi component nên làm **MỘT việc** duy nhất. Nếu component quá lớn, hãy tách thành các component nhỏ hơn.`,
        vizConfig: {
          nodes: [
            {
              id: "layout",
              label: "Layout (Composition)",
              x: 0,
              y: 5.5,
              color: "#7c3aed",
              glowColor: "#7c3aed",
            },
            {
              id: "header",
              label: "Header",
              x: -7,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "main",
              label: "Main",
              x: 0,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "footer",
              label: "Footer",
              x: 7,
              y: 3.5,
              color: "#56D9D1",
              glowColor: "#56D9D1",
            },
            {
              id: "nav",
              label: "Nav",
              x: -9.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "logo",
              label: "Logo",
              x: -4.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "productList",
              label: "ProductList",
              x: -1.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "sidebar",
              label: "Sidebar",
              x: 1.5,
              y: 1.5,
              color: "#10b981",
              glowColor: "#10b981",
            },
            {
              id: "one_thing",
              label: "DO ONE THING WELL",
              x: 0,
              y: -1,
              color: "#FF9B62",
              glowColor: "#FF9B62",
            },
          ],
          connections: [
            { fromIndex: 0, toIndex: 1 },
            { fromIndex: 0, toIndex: 2 },
            { fromIndex: 0, toIndex: 3 },
            { fromIndex: 1, toIndex: 4 },
            { fromIndex: 1, toIndex: 5 },
            { fromIndex: 2, toIndex: 6 },
            { fromIndex: 2, toIndex: 7 },
            { fromIndex: 6, toIndex: 8 },
          ],
          cameraPosition: [0, 1, 16],
        },
      },
    ];

    for (const ch of chapters) {
      const { content_en, content_vi, ...rest } = ch as any;
      const blocks = (ch as any).blocks || [
        {
          type: "text",
          text_en: content_en || "",
          text_vi: content_vi || "",
        },
      ];
      await ctx.db.insert("chapters", {
        walkthroughId,
        ...rest,
        content_en,
        content_vi,
        blocks,
      });
    }

    return walkthroughId;
  },
});

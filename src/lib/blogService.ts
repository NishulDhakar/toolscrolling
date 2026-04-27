const KEY = 'blogPosts';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  publishedAt: number;
  updatedAt: number;
  status: 'draft' | 'published';
  readTime: number;
}

const SEED: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Best AI Coding Tools in 2026',
    slug: 'best-ai-coding-tools-2026',
    excerpt: 'AI has fundamentally changed how developers write code. Cursor, Windsurf, and GitHub Copilot are leading a new era of AI-assisted development.',
    content: `# The AI Coding Landscape Has Exploded

Just two years ago, autocomplete was the ceiling. Today, AI agents can plan features, write full components, and debug across your entire codebase without you lifting a finger.

## Cursor

**Cursor** leads the pack with its deep VS Code integration and multi-file context awareness. It understands your project structure, naming conventions, and can rewrite entire modules from a simple prompt.

## Windsurf by Codeium

Windsurf takes a more *agentic approach* — it runs multi-step tasks end-to-end, browsing files, running commands, and iterating until the job is done.

## GitHub Copilot

Now on its third generation, Copilot remains the most widely deployed. Its strength is consistency — it integrates everywhere and rarely surprises you.

## How to Choose

The right choice depends on your workflow:

- **Cursor** — best for single codebase, deep context awareness
- **Windsurf** — best for agentic, multi-step tasks
- **Copilot** — best for broad language support and ubiquity

---

> If you're starting a new project today, try Cursor. The productivity gain in the first week alone is worth the switch.`,
    coverImage: 'https://picsum.photos/seed/aicode/800/450',
    author: 'ToolScrolling Team',
    tags: ['AI', 'Development', 'Productivity'],
    publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'published',
    readTime: 5,
  },
  {
    id: 'post-2',
    title: 'Why Supabase Is Replacing Firebase for Most New Projects',
    slug: 'supabase-vs-firebase-2026',
    excerpt: 'Supabase hit a tipping point. With a full Postgres backend, built-in auth, edge functions, and a generous free tier, it now outperforms Firebase on almost every dimension.',
    content: `# Supabase vs Firebase in 2026

When Firebase launched, it was a revelation. Real-time sync, auth, and hosting under one roof changed how solo developers built backends. But cracks appeared quickly.

## The Problems with Firebase

- **Vendor lock-in** — migrating away is painful
- **NoSQL growing pains** — relational data modelled as documents gets messy fast
- **Pricing** — can punish success with sudden cost spikes

## Why Supabase Wins

Supabase entered with a different philosophy: **open source first, SQL always, Postgres under the hood**. The result is a backend platform you can self-host, query with any SQL tool, and migrate away from without a rewrite.

### Developer Experience

The dashboard is clean, the client libraries are excellent, and Row Level Security policies (RLS) make auth logic co-located with your data — exactly where it belongs.

\`\`\`sql
-- RLS example: users can only read their own rows
create policy "Users read own data"
  on profiles for select
  using (auth.uid() = user_id);
\`\`\`

## Verdict

For most new projects in 2026, Supabase is the default choice. Firebase still wins for real-time at massive scale with minimal ops overhead — but for everything else, Supabase is the better bet.

---

> Supabase is what Firebase should have been.`,
    coverImage: 'https://picsum.photos/seed/database/800/450',
    author: 'ToolScrolling Team',
    tags: ['Development', 'Backend', 'Database'],
    publishedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'published',
    readTime: 4,
  },
  {
    id: 'post-3',
    title: '10 VS Code Extensions Every Developer Should Install',
    slug: 'top-vscode-extensions-2026',
    excerpt: 'A curated list of must-have VS Code extensions that improve your workflow, reduce bugs, and make your editor feel purpose-built for your stack.',
    content: `# 10 VS Code Extensions Worth Installing

The marketplace has tens of thousands of extensions. These ten have been vetted across real production workflows.

## Formatting & Linting

1. **Prettier** — the non-negotiable formatter. Set it to format on save and never think about spacing again.
2. **ESLint** — catches bugs before the runtime does. Pair with Prettier for zero-conflict formatting + linting.
3. **Error Lens** — surfaces errors *inline*, right on the offending line. Far faster than the Problems panel.

## Git

4. **GitLens** — supercharges built-in git with inline blame, branch history, and rich diff views.

## Productivity

5. **Tailwind CSS IntelliSense** — autocomplete, linting, and hover previews for Tailwind classes.
6. **REST Client** — send HTTP requests from a \`.http\` file. Replaces Postman for quick API testing.
7. **Import Cost** — shows the bundle size of each import inline. Keeps your bundle honest.
8. **Better Comments** — color-codes comment types (\`TODO\`, \`FIXME\`, \`NOTE\`) for quick scanning.
9. **Path Intellisense** — autocompletes file paths as you type imports. Eliminates typos in relative paths.
10. **Auto Rename Tag** — renames the matching HTML/JSX closing tag when you edit the opening one.

---

> Install these once and they quietly compound. You'll stop noticing them because they stop errors before you notice those too.`,
    coverImage: 'https://picsum.photos/seed/vscode/800/450',
    author: 'ToolScrolling Team',
    tags: ['Development', 'Productivity', 'VS Code'],
    publishedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    status: 'published',
    readTime: 6,
  },
  {
    id: 'post-4',
    title: 'Getting Started with Cursor: A Practical Guide',
    slug: 'getting-started-with-cursor',
    excerpt: 'Cursor is not just VS Code with Copilot. Multi-file context, composer mode, and codebase indexing change how you think about writing code.',
    content: `# Getting the Most Out of Cursor

Cursor looks familiar because it is built on VS Code. Every extension, keybinding, and theme you already have will carry over. The difference is in how *deeply* AI is woven into the editing experience.

## Tab — Smarter Autocomplete

Start with **Tab**. It is smarter than Copilot because it has more context: open files, recent edits, and your cursor position. Let it surprise you.

## Cmd+K — Inline Editing

Select code, press \`Cmd+K\`, describe what you want, and Cursor rewrites it in place. This is the fastest way to refactor small blocks.

## Cmd+L — Chat Panel

This is where you explain bigger changes. The key is **context** — use \`@\` to reference specific files, functions, or docs. The more precise, the better the output.

## Composer — Multi-File Agent

\`Cmd+Shift+I\` is Cursor's most powerful feature. Describe a multi-step change and it plans and executes across multiple files simultaneously.

Use it for:
- Adding a new route end-to-end
- Refactoring a data model
- Wiring up a new component with its service layer

## Pro Tip: Index Your Codebase

Go to **Cursor Settings → Features → Codebase Indexing** before using the chat. It makes all context suggestions dramatically more accurate.

---

> Composer alone is worth the subscription. Once you use it for a feature, you won't want to go back.`,
    coverImage: 'https://picsum.photos/seed/cursor/800/450',
    author: 'ToolScrolling Team',
    tags: ['AI', 'Development', 'Cursor'],
    publishedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    status: 'published',
    readTime: 7,
  },
];

function read(): BlogPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function write(posts: BlogPost[]): void {
  localStorage.setItem(KEY, JSON.stringify(posts));
}

function uid(): string {
  return 'post-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function getAllPosts(): BlogPost[] {
  return read();
}

export function getPublishedPosts(): BlogPost[] {
  return read()
    .filter(p => p.status === 'published')
    .sort((a, b) => b.publishedAt - a.publishedAt);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return read().find(p => p.slug === slug);
}

export function getPostById(id: string): BlogPost | undefined {
  return read().find(p => p.id === id);
}

export function createPost(
  data: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'updatedAt'>
): BlogPost {
  const posts = read();
  const now = Date.now();
  const post: BlogPost = {
    ...data,
    id: uid(),
    slug: slugify(data.title),
    publishedAt: now,
    updatedAt: now,
  };
  write([...posts, post]);
  return post;
}

export function updatePost(id: string, data: Partial<Omit<BlogPost, 'id'>>): BlogPost | null {
  const posts = read();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated: BlogPost = { ...posts[idx], ...data, updatedAt: Date.now() };
  if (data.title && !data.slug) updated.slug = slugify(data.title);
  posts[idx] = updated;
  write(posts);
  return updated;
}

export function deletePost(id: string): boolean {
  const posts = read();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;
  write(filtered);
  return true;
}

export function togglePublish(id: string): BlogPost | null {
  const posts = read();
  const post = posts.find(p => p.id === id);
  if (!post) return null;
  return updatePost(id, {
    status: post.status === 'published' ? 'draft' : 'published',
  });
}

# ToolScrolling

A curated platform for discovering developer and design tools with search, filtering, likes, and an admin panel.

## Features

- Browse 30+ curated tools across categories (Development, Design, AI, Productivity)
- Real-time search and category filtering
- Like and save favorite tools (persists in localStorage)
- Password-protected admin panel for managing tools
- Dark/light mode with responsive design

## Quick Start

```bash
# Clone and install
git clone https://github.com/NishulDhakar/toolscrolling.git
cd toolscrolling
npm install

# Configure admin password
echo "NEXT_PUBLIC_ADMIN_PASSWORD=your_password" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

Access at `/admin` with the password set in `.env.local`

- Add, edit, and delete custom tools
- View tool statistics
- Protected routes with session management

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Motion (animations)
- localStorage (data persistence)

## Project Structure

```
src/
├── app/              # Pages (landing, feed, saves, admin)
├── components/       # UI components
├── data/            # Static tool data
└── lib/             # Services (auth, likes, tools)
```

## Deployment

Deploy to Vercel or any Next.js-compatible platform. Set `NEXT_PUBLIC_ADMIN_PASSWORD` environment variable.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## License

MIT

---

Made by [Nishul Dhakar](https://github.com/NishulDhakar)

<img width="1920" height="1440" alt="image" src="https://github.com/user-attachments/assets/b14e3e90-5250-45db-8a93-1e69d9c54dfa" /># ToolScrolling

A curated platform for discovering developer and design tools with search, filtering, likes, and an admin panel.

![116shots_so](https://github.com/user-attachments/assets/f9431912-d8c2-4877-89fe-f100b55824fd)


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

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

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

---

Made by [Nishul Dhakar](https://github.com/NishulDhakar)

<<<<<<< HEAD
Cooking....
=======
# 🛠️ ToolScrolling

> A modern, curated platform for discovering the best developer and design tools

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

## ✨ Features

### 🎯 For Users
- **Curated Tool Collection** - Browse 30+ handpicked development, design, AI, and productivity tools
- **Smart Search** - Instantly find tools with real-time search across titles and descriptions
- **Category Filters** - Filter by Development, Design, AI, Productivity, and more
- **Like System** - Like your favorite tools with persistent, real-time like counts
- **Save Tools** - Bookmark tools to your personal collection for quick access
- **Dark Mode** - Beautiful dark/light theme with smooth transitions
- **Responsive Design** - Flawless experience across desktop, tablet, and mobile

### 🔐 For Admins
- **Secure Admin Panel** - Password-protected admin dashboard
- **Add Custom Tools** - Expand the collection with new tools
- **Edit Tools** - Update tool information (custom tools only)
- **Delete Tools** - Remove custom tools from the collection
- **Tool Statistics** - Track total tools, custom additions, and static tools
- **Environment-Based Auth** - Secure password storage via `.env.local`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NishulDhakar/toolscrolling.git
   cd toolscrolling
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
   ```
   
   > 💡 See `.env.example` for reference

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Browse Tools
- Visit the **Feed** page to explore all tools
- Use the **search bar** to find specific tools
- Click **category buttons** in the sidebar to filter
- Click **❤️ to like** tools and **🔖 to save** them

### Save & Manage
- Access your **Saved Tools** from the sidebar
- View all your bookmarked tools in one place
- Like counts persist across sessions

### Admin Access
1. Navigate to `/admin`
2. Enter your password (set in `.env.local`)
3. Manage tools from the admin dashboard

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Storage:** localStorage (client-side persistence)

## 📁 Project Structure

```
toolscrolling/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── feed/         # Tool feed page
│   │   ├── saves/        # Saved tools page
│   │   └── admin/        # Admin panel pages
│   ├── components/       # React components
│   │   ├── Navbar.tsx    # Navigation bar
│   │   ├── Sidebar.tsx   # Category sidebar
│   │   ├── ToolsCard.tsx # Tool display card
│   │   └── ...
│   ├── data/             # Static data
│   │   └── tools.ts      # Tool definitions
│   ├── lib/              # Utilities & services
│   │   ├── authService.ts    # Authentication logic
│   │   ├── likeService.ts    # Like system
│   │   └── toolsService.ts   # Tool management
│   └── styles/           # Global styles
├── public/               # Static assets
└── .env.local           # Environment variables (create this)
```

## 🔒 Security

### Admin Authentication
- Password stored securely in `.env.local` (never committed to git)
- Client-side session management with localStorage
- Route protection for all admin pages
- Secure logout functionality

> ⚠️ **Note:** This is a client-side authentication system suitable for personal projects. For production applications with sensitive data, implement server-side authentication.

## 🎨 Features in Detail

### Like System
- Real-time like counts for all tools
- Persistent storage in localStorage
- Like/unlike with visual feedback
- Counts survive page refreshes

### Tool Management
- Add new tools with comprehensive validation
- Edit custom tools (static tools protected)
- Delete with confirmation
- Full CRUD operations

### Search & Filter
- Instant search across tool names and descriptions
- Category-based filtering
- "No results" state with clear filters option

## 🚢 Deployment

### Deploy to Vercel

The easiest way to deploy:

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variable: `NEXT_PUBLIC_ADMIN_PASSWORD`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/NishulDhakar/toolscrolling)

### Environment Variables for Production

Set these in your hosting platform:
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin panel password

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Nishul Dhakar**
- GitHub: [@NishulDhakar](https://github.com/NishulDhakar)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Tool icons and logos belong to their respective owners
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/NishulDhakar">Nishul Dhakar</a>
</div>
>>>>>>> 15e1f65 (update readme)

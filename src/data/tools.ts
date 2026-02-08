export interface Tool {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  category: 'Development' | 'Design' | 'Productivity' | 'AI' | 'Other';
  initialLikes: number;
}

export const tools: Tool[] = [
  {
    id: '1',
    title: 'VS Code',
    description: 'A powerful, lightweight code editor for developers.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png',
    link: 'https://code.visualstudio.com/',
    category: 'Development',
    initialLikes: 1250,
  },
  {
    id: '2',
    title: 'Figma',
    description: 'The collaborative interface design tool.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg',
    link: 'https://www.figma.com/',
    category: 'Design',
    initialLikes: 980,
  },
  {
    id: '3',
    title: 'ChatGPT',
    description: 'An AI-powered chatbot by OpenAI.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    link: 'https://chat.openai.com/',
    category: 'AI',
    initialLikes: 2500,
  },
  {
    id: '4',
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework for rapid UI development.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    link: 'https://tailwindcss.com/',
    category: 'Development',
    initialLikes: 850,
  },
  {
    id: '5',
    title: 'Canva',
    description: 'A graphic design platform that allows users to create social media graphics, presentations, posters, documents and other visual content.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    link: 'https://www.canva.com/',
    category: 'Design',
    initialLikes: 1100,
  },
  {
    id: '6',
    title: 'Notion',
    description: 'A workspace for your team to write, plan, and get organized.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
    link: 'https://www.notion.so/',
    category: 'Productivity',
    initialLikes: 1400,
  },
  {
    id: '7',
    title: 'Midjourney',
    description: 'An independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
    link: 'https://www.midjourney.com/',
    category: 'AI',
    initialLikes: 1800,
  },
  {
    id: '8',
    title: 'Vercel',
    description: 'Develop. Preview. Ship. For the best frontend teams.',
    image: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
    link: 'https://vercel.com/',
    category: 'Development',
    initialLikes: 920,
  },
    {
    id: '9',
    title: 'Dribbble',
    description: 'The leading destination to find & showcase creative work and home to the world\'s best design professionals.',
    image: 'https://cdn.freebiesupply.com/logos/large/2x/dribbble-icon-1-logo-png-transparent.png',
    link: 'https://dribbble.com/',
    category: 'Design',
    initialLikes: 750,
  },
    {
    id: '10',
    title: 'Linear',
    description: 'The issue tracking tool you\'ll enjoy using.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Linear_logo.svg', // Placeholder valid SVG link to avoid broken image if possible, but using wiki for now
    link: 'https://linear.app/',
    category: 'Productivity',
    initialLikes: 600,
  },
];

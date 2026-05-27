import type { PortalDataset } from "./types";

export const defaultDataset: PortalDataset = {
  profile: {
    name: "Wnn",
    bio: "Curating digital experiences with a focus on minimalism and high-performance design.",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSRLkuyneZ18bbyhE7Mtztjfh-p6HBxGcAyxM2_Tu5_PW7APqpBCgwEDuOZiueNMft044fN2dX5_H5Q2JV9kA5bKlfB8fERgY29QZBAfwlAQScOmAiWquQgyNtRIsq3hvuLKZTX9F480tDFyw4VGS9I2V3TYjgw4wBf1yKSTYpAd0cvkUVVMU3YmEesfY_03vnYx6CCP__mnY6M3J7cXHErCJrrns8kDr3LhEY0y1_ETvsaUxt6wQ5jN53nHkuwz4MUKYJj7ieIs",
    footerText: "© 2026 Wnn Portal.<br />Lightweight & Efficient."
  },
  settings: {
    siteTitle: "Wnn Portal",
    seoDescription:
      "Wnn Portal is a high-performance personal navigation site for links, tools, and contact entry points.",
    defaultTheme: "system",
    analyticsId: ""
  },
  searchEngines: [
    { name: "Google", icon: "search", url: "https://www.google.com/search?q=" },
    { name: "Baidu", icon: "language", url: "https://www.baidu.com/s?wd=" },
    { name: "Bing", icon: "travel_explore", url: "https://www.bing.com/search?q=" }
  ],
  categories: [
    { id: "tools", name: "Tools", icon: "build", sortOrder: 1, isActive: true },
    { id: "ai", name: "AI", icon: "smart_toy", sortOrder: 2, isActive: true },
    { id: "design", name: "Design", icon: "brush", sortOrder: 3, isActive: true },
    { id: "development", name: "Development", icon: "code", sortOrder: 4, isActive: true },
    { id: "life", name: "Life", icon: "favorite", sortOrder: 5, isActive: true }
  ],
  links: [
    {
      id: "openai",
      title: "OpenAI",
      description: "Cutting-edge AI research and product development.",
      categoryId: "ai",
      categoryName: "AI",
      icon: "psychology",
      url: "https://openai.com",
      sortOrder: 1,
      isActive: true
    },
    {
      id: "figma",
      title: "Figma",
      description: "Collaborative interface design tool for modern teams.",
      categoryId: "design",
      categoryName: "Design",
      icon: "palette",
      url: "https://figma.com",
      sortOrder: 2,
      isActive: true
    },
    {
      id: "github",
      title: "GitHub",
      description: "Where the world builds software together.",
      categoryId: "development",
      categoryName: "Development",
      icon: "code",
      url: "https://github.com",
      sortOrder: 3,
      isActive: true
    },
    {
      id: "midjourney",
      title: "Midjourney",
      description: "Expanding the imaginative powers of human species.",
      categoryId: "ai",
      categoryName: "AI",
      icon: "smart_toy",
      url: "https://midjourney.com",
      sortOrder: 4,
      isActive: true
    },
    {
      id: "dribbble",
      title: "Dribbble",
      description: "The leading destination to find and showcase creative work.",
      categoryId: "design",
      categoryName: "Design",
      icon: "draw",
      url: "https://dribbble.com",
      sortOrder: 5,
      isActive: true
    },
    {
      id: "notion",
      title: "Notion",
      description: "Your connected workspace for wiki, docs and projects.",
      categoryId: "tools",
      categoryName: "Tools",
      icon: "book",
      url: "https://notion.so",
      sortOrder: 6,
      isActive: true
    },
    {
      id: "daily-life",
      title: "Daily Life",
      description: "A blog about minimalist lifestyle and efficiency.",
      categoryId: "life",
      categoryName: "Life",
      icon: "favorite",
      url: "https://life.wnn.dev",
      sortOrder: 7,
      isActive: true
    },
    {
      id: "arc",
      title: "Arc Browser",
      description: "A browsing experience that works for you.",
      categoryId: "tools",
      categoryName: "Tools",
      icon: "browser_updated",
      url: "https://arc.net",
      sortOrder: 8,
      isActive: true
    },
    {
      id: "nextjs",
      title: "Next.js",
      description: "The React Framework for the Web.",
      categoryId: "development",
      categoryName: "Development",
      icon: "javascript",
      url: "https://nextjs.org",
      sortOrder: 9,
      isActive: true
    },
    {
      id: "tailwind",
      title: "Tailwind CSS",
      description: "A utility-first CSS framework for rapid UI development.",
      categoryId: "development",
      categoryName: "Development",
      icon: "css",
      url: "https://tailwindcss.com",
      sortOrder: 10,
      isActive: true
    },
    {
      id: "pinterest",
      title: "Pinterest",
      description: "Discover recipes, home ideas, and style inspiration.",
      categoryId: "design",
      categoryName: "Design",
      icon: "collections",
      url: "https://pinterest.com",
      sortOrder: 11,
      isActive: true
    }
  ],
  socials: [
    { id: "email", label: "Email", icon: "mail", url: "mailto:mail@hai.pw", sortOrder: 1, isActive: true },
    { id: "telegram", label: "Telegram", icon: "send", url: "#", sortOrder: 2, isActive: true },
    { id: "github", label: "GitHub", icon: "terminal", url: "https://github.com/wnn", sortOrder: 3, isActive: true },
    { id: "discord", label: "Discord", icon: "forum", url: "#", sortOrder: 4, isActive: true },
    { id: "wechat", label: "WeChat", icon: "chat", url: "#", sortOrder: 5, isActive: true },
    { id: "twitter", label: "Twitter", icon: "alternate_email", url: "#", sortOrder: 6, isActive: true },
    { id: "qq", label: "QQ", icon: "mode_comment", url: "#", sortOrder: 7, isActive: true },
    { id: "blog", label: "Blog", icon: "rss_feed", url: "#", sortOrder: 8, isActive: true }
  ],
  featuredLinks: [
    { id: "github", label: "GitHub", icon: "code", hint: "github.com/wnn", url: "https://github.com/wnn/portal", sortOrder: 1, isActive: true },
    { id: "telegram", label: "Telegram", icon: "send", hint: "t.me/wnn", url: "#", sortOrder: 2, isActive: true },
    { id: "email", label: "Email", icon: "mail", hint: "mail@hai.pw", url: "mailto:mail@hai.pw", sortOrder: 3, isActive: true }
  ]
};

import type { PortalDataset } from "./types";

export const defaultDataset: PortalDataset = {
  profile: {
    name: "Wnn",
    bio: "收集常用工具、创作资源和个人入口，保持简洁、高效、好访问。",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSRLkuyneZ18bbyhE7Mtztjfh-p6HBxGcAyxM2_Tu5_PW7APqpBCgwEDuOZiueNMft044fN2dX5_H5Q2JV9kA5bKlfB8fERgY29QZBAfwlAQScOmAiWquQgyNtRIsq3hvuLKZTX9F480tDFyw4VGS9I2V3TYjgw4wBf1yKSTYpAd0cvkUVVMU3YmEesfY_03vnYx6CCP__mnY6M3J7cXHErCJrrns8kDr3LhEY0y1_ETvsaUxt6wQ5jN53nHkuwz4MUKYJj7ieIs",
    footerText: "© 2026 Wnn Portal.<br />轻量、高效、可自托管。"
  },
  settings: {
    siteTitle: "Wnn 个人导航",
    seoDescription: "Wnn 的个人导航站，集中管理常用链接、工具资源和联系方式。",
    defaultTheme: "system",
    analyticsId: ""
  },
  searchEngines: [
    { name: "Google", icon: "search", url: "https://www.google.com/search?q=" },
    { name: "百度", icon: "language", url: "https://www.baidu.com/s?wd=" },
    { name: "必应", icon: "travel_explore", url: "https://www.bing.com/search?q=" }
  ],
  categories: [
    { id: "tools", name: "工具", icon: "build", sortOrder: 1, isActive: true },
    { id: "ai", name: "AI", icon: "smart_toy", sortOrder: 2, isActive: true },
    { id: "design", name: "设计", icon: "brush", sortOrder: 3, isActive: true },
    { id: "development", name: "开发", icon: "code", sortOrder: 4, isActive: true },
    { id: "life", name: "生活", icon: "favorite", sortOrder: 5, isActive: true }
  ],
  links: [
    {
      id: "openai",
      title: "OpenAI",
      description: "前沿 AI 研究、模型能力和产品入口。",
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
      description: "适合团队协作的界面设计和原型工具。",
      categoryId: "design",
      categoryName: "设计",
      icon: "palette",
      url: "https://figma.com",
      sortOrder: 2,
      isActive: true
    },
    {
      id: "github",
      title: "GitHub",
      description: "代码托管、协作开发和开源项目平台。",
      categoryId: "development",
      categoryName: "开发",
      icon: "code",
      url: "https://github.com",
      sortOrder: 3,
      isActive: true
    },
    {
      id: "midjourney",
      title: "Midjourney",
      description: "高质量 AI 图像生成和创意探索工具。",
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
      description: "发现优秀设计作品和视觉灵感的平台。",
      categoryId: "design",
      categoryName: "设计",
      icon: "draw",
      url: "https://dribbble.com",
      sortOrder: 5,
      isActive: true
    },
    {
      id: "notion",
      title: "Notion",
      description: "用于文档、知识库和项目管理的工作空间。",
      categoryId: "tools",
      categoryName: "工具",
      icon: "book",
      url: "https://notion.so",
      sortOrder: 6,
      isActive: true
    },
    {
      id: "daily-life",
      title: "日常生活",
      description: "记录极简生活、效率方法和个人想法。",
      categoryId: "life",
      categoryName: "生活",
      icon: "favorite",
      url: "https://life.wnn.dev",
      sortOrder: 7,
      isActive: true
    },
    {
      id: "arc",
      title: "Arc 浏览器",
      description: "更现代、更专注的浏览器体验。",
      categoryId: "tools",
      categoryName: "工具",
      icon: "browser_updated",
      url: "https://arc.net",
      sortOrder: 8,
      isActive: true
    },
    {
      id: "nextjs",
      title: "Next.js",
      description: "用于构建现代 Web 应用的 React 框架。",
      categoryId: "development",
      categoryName: "开发",
      icon: "javascript",
      url: "https://nextjs.org",
      sortOrder: 9,
      isActive: true
    },
    {
      id: "tailwind",
      title: "Tailwind CSS",
      description: "实用优先的 CSS 框架，适合快速搭建界面。",
      categoryId: "development",
      categoryName: "开发",
      icon: "css",
      url: "https://tailwindcss.com",
      sortOrder: 10,
      isActive: true
    },
    {
      id: "pinterest",
      title: "Pinterest",
      description: "发现图片灵感、家居想法和审美参考。",
      categoryId: "design",
      categoryName: "设计",
      icon: "collections",
      url: "https://pinterest.com",
      sortOrder: 11,
      isActive: true
    }
  ],
  socials: [
    { id: "email", label: "邮箱", icon: "mail", url: "mailto:mail@hai.pw", sortOrder: 1, isActive: true },
    { id: "telegram", label: "Telegram", icon: "send", url: "#", sortOrder: 2, isActive: true },
    { id: "github", label: "GitHub", icon: "terminal", url: "https://github.com/wnn", sortOrder: 3, isActive: true },
    { id: "discord", label: "Discord", icon: "forum", url: "#", sortOrder: 4, isActive: true },
    { id: "wechat", label: "微信", icon: "chat", url: "#", sortOrder: 5, isActive: true },
    { id: "twitter", label: "Twitter / X", icon: "alternate_email", url: "#", sortOrder: 6, isActive: true },
    { id: "qq", label: "QQ", icon: "mode_comment", url: "#", sortOrder: 7, isActive: true },
    { id: "blog", label: "博客", icon: "rss_feed", url: "#", sortOrder: 8, isActive: true }
  ],
  featuredLinks: [
    { id: "github", label: "GitHub", icon: "code", hint: "github.com/wnn", url: "https://github.com/wnn/portal", sortOrder: 1, isActive: true },
    { id: "telegram", label: "Telegram", icon: "send", hint: "t.me/wnn", url: "#", sortOrder: 2, isActive: true },
    { id: "email", label: "邮箱", icon: "mail", hint: "mail@hai.pw", url: "mailto:mail@hai.pw", sortOrder: 3, isActive: true }
  ]
};

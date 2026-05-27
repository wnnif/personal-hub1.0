import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const existingProfile = await prisma.profileSetting.findUnique({ where: { id: "main" } });
if (existingProfile) {
  console.log("Seed data already exists; skipping.");
  await prisma.$disconnect();
  process.exit(0);
}

const profile = {
  id: "main",
  name: "Wnn",
  bio: "收集常用工具、创作资源和个人入口，保持简洁、高效、好访问。",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSRLkuyneZ18bbyhE7Mtztjfh-p6HBxGcAyxM2_Tu5_PW7APqpBCgwEDuOZiueNMft044fN2dX5_H5Q2JV9kA5bKlfB8fERgY29QZBAfwlAQScOmAiWquQgyNtRIsq3hvuLKZTX9F480tDFyw4VGS9I2V3TYjgw4wBf1yKSTYpAd0cvkUVVMU3YmEesfY_03vnYx6CCP__mnY6M3J7cXHErCJrrns8kDr3LhEY0y1_ETvsaUxt6wQ5jN53nHkuwz4MUKYJj7ieIs",
  footerText: "© 2026 Wnn Portal.<br />轻量、高效、可自托管。"
};

const settings = {
  id: "main",
  siteTitle: "Wnn 个人导航",
  seoDescription: "Wnn 的个人导航站，集中管理常用链接、工具资源和联系方式。",
  defaultTheme: "system",
  analyticsId: ""
};

const categories = [
  { id: "tools", name: "工具", icon: "build", sortOrder: 1, isActive: true },
  { id: "ai", name: "AI", icon: "smart_toy", sortOrder: 2, isActive: true },
  { id: "design", name: "设计", icon: "brush", sortOrder: 3, isActive: true },
  { id: "development", name: "开发", icon: "code", sortOrder: 4, isActive: true },
  { id: "life", name: "生活", icon: "favorite", sortOrder: 5, isActive: true }
];

const links = [
  ["openai", "OpenAI", "前沿 AI 研究、模型能力和产品入口。", "https://openai.com", "psychology", "ai", 1],
  ["figma", "Figma", "适合团队协作的界面设计和原型工具。", "https://figma.com", "palette", "design", 2],
  ["github", "GitHub", "代码托管、协作开发和开源项目平台。", "https://github.com", "code", "development", 3],
  ["midjourney", "Midjourney", "高质量 AI 图像生成和创意探索工具。", "https://midjourney.com", "smart_toy", "ai", 4],
  ["dribbble", "Dribbble", "发现优秀设计作品和视觉灵感的平台。", "https://dribbble.com", "draw", "design", 5],
  ["notion", "Notion", "用于文档、知识库和项目管理的工作空间。", "https://notion.so", "book", "tools", 6],
  ["daily-life", "日常生活", "记录极简生活、效率方法和个人想法。", "https://life.wnn.dev", "favorite", "life", 7],
  ["arc", "Arc 浏览器", "更现代、更专注的浏览器体验。", "https://arc.net", "browser_updated", "tools", 8],
  ["nextjs", "Next.js", "用于构建现代 Web 应用的 React 框架。", "https://nextjs.org", "javascript", "development", 9],
  ["tailwind", "Tailwind CSS", "实用优先的 CSS 框架，适合快速搭建界面。", "https://tailwindcss.com", "css", "development", 10],
  ["pinterest", "Pinterest", "发现图片灵感、家居想法和审美参考。", "https://pinterest.com", "collections", "design", 11]
];

const socials = [
  { id: "email", label: "邮箱", icon: "mail", url: "mailto:mail@hai.pw", sortOrder: 1, isActive: true },
  { id: "telegram", label: "Telegram", icon: "send", url: "#", sortOrder: 2, isActive: true },
  { id: "github", label: "GitHub", icon: "terminal", url: "https://github.com/wnn", sortOrder: 3, isActive: true },
  { id: "discord", label: "Discord", icon: "forum", url: "#", sortOrder: 4, isActive: true },
  { id: "wechat", label: "微信", icon: "chat", url: "#", sortOrder: 5, isActive: true },
  { id: "twitter", label: "Twitter / X", icon: "alternate_email", url: "#", sortOrder: 6, isActive: true },
  { id: "qq", label: "QQ", icon: "mode_comment", url: "#", sortOrder: 7, isActive: true },
  { id: "blog", label: "博客", icon: "rss_feed", url: "#", sortOrder: 8, isActive: true }
];

const featuredLinks = [
  { id: "github", label: "GitHub", icon: "code", hint: "github.com/wnn", url: "https://github.com/wnn/portal", sortOrder: 1, isActive: true },
  { id: "telegram", label: "Telegram", icon: "send", hint: "t.me/wnn", url: "#", sortOrder: 2, isActive: true },
  { id: "email", label: "邮箱", icon: "mail", hint: "mail@hai.pw", url: "mailto:mail@hai.pw", sortOrder: 3, isActive: true }
];

await prisma.profileSetting.upsert({ where: { id: "main" }, update: {}, create: profile });
await prisma.siteSetting.upsert({ where: { id: "main" }, update: {}, create: settings });

for (const category of categories) {
  await prisma.category.upsert({ where: { id: category.id }, update: {}, create: category });
}

for (const [id, title, description, url, icon, categoryId, sortOrder] of links) {
  await prisma.portalLink.upsert({
    where: { id },
    update: {},
    create: { id, title, description, url, icon, categoryId, sortOrder, isActive: true }
  });
}

for (const social of socials) {
  await prisma.socialLink.upsert({ where: { id: social.id }, update: {}, create: social });
}

for (const link of featuredLinks) {
  await prisma.featuredLink.upsert({ where: { id: link.id }, update: {}, create: link });
}

await prisma.$disconnect();

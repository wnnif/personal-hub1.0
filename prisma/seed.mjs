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
  bio: "Curating digital experiences with a focus on minimalism and high-performance design.",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCgSRLkuyneZ18bbyhE7Mtztjfh-p6HBxGcAyxM2_Tu5_PW7APqpBCgwEDuOZiueNMft044fN2dX5_H5Q2JV9kA5bKlfB8fERgY29QZBAfwlAQScOmAiWquQgyNtRIsq3hvuLKZTX9F480tDFyw4VGS9I2V3TYjgw4wBf1yKSTYpAd0cvkUVVMU3YmEesfY_03vnYx6CCP__mnY6M3J7cXHErCJrrns8kDr3LhEY0y1_ETvsaUxt6wQ5jN53nHkuwz4MUKYJj7ieIs",
  footerText: "© 2026 Wnn Portal.<br />Lightweight & Efficient."
};

const settings = {
  id: "main",
  siteTitle: "Wnn Portal",
  seoDescription:
    "Wnn Portal is a high-performance personal navigation site for links, tools, and contact entry points.",
  defaultTheme: "system",
  analyticsId: ""
};

const categories = [
  { id: "tools", name: "Tools", icon: "build", sortOrder: 1, isActive: true },
  { id: "ai", name: "AI", icon: "smart_toy", sortOrder: 2, isActive: true },
  { id: "design", name: "Design", icon: "brush", sortOrder: 3, isActive: true },
  { id: "development", name: "Development", icon: "code", sortOrder: 4, isActive: true },
  { id: "life", name: "Life", icon: "favorite", sortOrder: 5, isActive: true }
];

const links = [
  ["openai", "OpenAI", "Cutting-edge AI research and product development.", "https://openai.com", "psychology", "ai", 1],
  ["figma", "Figma", "Collaborative interface design tool for modern teams.", "https://figma.com", "palette", "design", 2],
  ["github", "GitHub", "Where the world builds software together.", "https://github.com", "code", "development", 3],
  ["midjourney", "Midjourney", "Expanding the imaginative powers of human species.", "https://midjourney.com", "smart_toy", "ai", 4],
  ["dribbble", "Dribbble", "The leading destination to find and showcase creative work.", "https://dribbble.com", "draw", "design", 5],
  ["notion", "Notion", "Your connected workspace for wiki, docs and projects.", "https://notion.so", "book", "tools", 6],
  ["daily-life", "Daily Life", "A blog about minimalist lifestyle and efficiency.", "https://life.wnn.dev", "favorite", "life", 7],
  ["arc", "Arc Browser", "A browsing experience that works for you.", "https://arc.net", "browser_updated", "tools", 8],
  ["nextjs", "Next.js", "The React Framework for the Web.", "https://nextjs.org", "javascript", "development", 9],
  ["tailwind", "Tailwind CSS", "A utility-first CSS framework for rapid UI development.", "https://tailwindcss.com", "css", "development", 10],
  ["pinterest", "Pinterest", "Discover recipes, home ideas, and style inspiration.", "https://pinterest.com", "collections", "design", 11]
];

const socials = [
  { id: "email", label: "Email", icon: "mail", url: "mailto:mail@hai.pw", sortOrder: 1, isActive: true },
  { id: "telegram", label: "Telegram", icon: "send", url: "#", sortOrder: 2, isActive: true },
  { id: "github", label: "GitHub", icon: "terminal", url: "https://github.com/wnn", sortOrder: 3, isActive: true },
  { id: "discord", label: "Discord", icon: "forum", url: "#", sortOrder: 4, isActive: true },
  { id: "wechat", label: "WeChat", icon: "chat", url: "#", sortOrder: 5, isActive: true },
  { id: "twitter", label: "Twitter", icon: "alternate_email", url: "#", sortOrder: 6, isActive: true },
  { id: "qq", label: "QQ", icon: "mode_comment", url: "#", sortOrder: 7, isActive: true },
  { id: "blog", label: "Blog", icon: "rss_feed", url: "#", sortOrder: 8, isActive: true }
];

const featuredLinks = [
  { id: "github", label: "GitHub", icon: "code", hint: "github.com/wnn", url: "https://github.com/wnn/portal", sortOrder: 1, isActive: true },
  { id: "telegram", label: "Telegram", icon: "send", hint: "t.me/wnn", url: "#", sortOrder: 2, isActive: true },
  { id: "email", label: "Email", icon: "mail", hint: "mail@hai.pw", url: "mailto:mail@hai.pw", sortOrder: 3, isActive: true }
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

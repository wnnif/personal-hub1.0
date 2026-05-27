import { defaultDataset } from "./default-data";
import { prisma } from "./db";
import type { Category, FeaturedLink, PortalDataset, PortalLink, Profile, SiteSettings, SocialLink } from "./types";

export async function getPortalDataset(): Promise<PortalDataset> {
  try {
    const [profile, settings, categories, links, socials, featuredLinks] = await Promise.all([
      prisma.profileSetting.findUnique({ where: { id: "main" } }),
      prisma.siteSetting.findUnique({ where: { id: "main" } }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.portalLink.findMany({ include: { category: true }, orderBy: { sortOrder: "asc" } }),
      prisma.socialLink.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.featuredLink.findMany({ orderBy: { sortOrder: "asc" } })
    ]);

    return {
      profile: profile
        ? {
            name: profile.name,
            bio: profile.bio,
            avatarUrl: profile.avatarUrl,
            footerText: profile.footerText
          }
        : defaultDataset.profile,
      settings: settings
        ? {
            siteTitle: settings.siteTitle,
            seoDescription: settings.seoDescription,
            defaultTheme: settings.defaultTheme as SiteSettings["defaultTheme"],
            analyticsId: settings.analyticsId
          }
        : defaultDataset.settings,
      searchEngines: defaultDataset.searchEngines,
      categories: categories.map(mapCategory),
      links: links.map((link) => ({
        id: link.id,
        title: link.title,
        description: link.description,
        url: link.url,
        icon: link.icon,
        categoryId: link.categoryId ?? "",
        categoryName: link.category?.name ?? "未分类",
        sortOrder: link.sortOrder,
        isActive: link.isActive
      })),
      socials: socials.map(mapSocial),
      featuredLinks: featuredLinks.map(mapFeatured)
    };
  } catch (error) {
    console.warn("Database unavailable, falling back to bundled defaults.", error);
    return defaultDataset;
  }
}

export async function upsertLink(link: PortalLink) {
  await prisma.portalLink.upsert({
    where: { id: link.id },
    update: {
      title: link.title,
      description: link.description,
      url: link.url,
      icon: link.icon,
      categoryId: link.categoryId || null,
      sortOrder: link.sortOrder,
      isActive: link.isActive
    },
    create: {
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      icon: link.icon,
      categoryId: link.categoryId || null,
      sortOrder: link.sortOrder,
      isActive: link.isActive
    }
  });
}

export async function removeLink(id: string) {
  await prisma.portalLink.delete({ where: { id } });
}

export async function upsertCategory(category: Category) {
  await prisma.category.upsert({
    where: { id: category.id },
    update: {
      name: category.name,
      icon: category.icon,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    },
    create: {
      id: category.id,
      name: category.name,
      icon: category.icon,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    }
  });
}

export async function removeCategory(id: string) {
  await prisma.category.delete({ where: { id } });
}

export async function updateProfile(profile: Profile, socials: SocialLink[], featuredLinks: FeaturedLink[]) {
  await prisma.profileSetting.upsert({
    where: { id: "main" },
    update: {
      name: profile.name,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      footerText: profile.footerText
    },
    create: {
      id: "main",
      name: profile.name,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      footerText: profile.footerText
    }
  });

  await prisma.$transaction([
    ...socials.map((social) =>
      prisma.socialLink.upsert({
        where: { id: social.id },
        update: {
          label: social.label,
          icon: social.icon,
          url: social.url,
          sortOrder: social.sortOrder,
          isActive: social.isActive
        },
        create: social
      })
    ),
    ...featuredLinks.map((link) =>
      prisma.featuredLink.upsert({
        where: { id: link.id },
        update: {
          label: link.label,
          icon: link.icon,
          hint: link.hint,
          url: link.url,
          sortOrder: link.sortOrder,
          isActive: link.isActive
        },
        create: link
      })
    )
  ]);
}

export async function updateSettings(settings: SiteSettings) {
  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {
      siteTitle: settings.siteTitle,
      seoDescription: settings.seoDescription,
      defaultTheme: settings.defaultTheme,
      analyticsId: settings.analyticsId
    },
    create: {
      id: "main",
      siteTitle: settings.siteTitle,
      seoDescription: settings.seoDescription,
      defaultTheme: settings.defaultTheme,
      analyticsId: settings.analyticsId
    }
  });
}

export async function recordVisit(date = getTodayKey()) {
  await prisma.visitStat.upsert({
    where: { date },
    update: {
      visitors: { increment: 1 }
    },
    create: {
      date,
      visitors: 1
    }
  });
}

export async function getVisitStats(days = 14) {
  const dates = getRecentDateKeys(days);
  const rows = await prisma.visitStat.findMany({
    where: {
      date: { in: dates }
    },
    orderBy: {
      date: "asc"
    }
  });

  return dates.map((date) => ({
    date,
    visitors: rows.find((row) => row.date === date)?.visitors ?? 0
  }));
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getRecentDateKeys(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (days - index - 1));
    return date.toISOString().slice(0, 10);
  });
}

function mapCategory(category: { id: string; name: string; icon: string; sortOrder: number; isActive: boolean }): Category {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon,
    sortOrder: category.sortOrder,
    isActive: category.isActive
  };
}

function mapSocial(social: { id: string; label: string; icon: string; url: string; sortOrder: number; isActive: boolean }): SocialLink {
  return {
    id: social.id,
    label: social.label,
    icon: social.icon,
    url: social.url,
    sortOrder: social.sortOrder,
    isActive: social.isActive
  };
}

function mapFeatured(link: { id: string; label: string; icon: string; hint: string; url: string; sortOrder: number; isActive: boolean }): FeaturedLink {
  return {
    id: link.id,
    label: link.label,
    icon: link.icon,
    hint: link.hint,
    url: link.url,
    sortOrder: link.sortOrder,
    isActive: link.isActive
  };
}

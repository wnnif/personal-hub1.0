import type { ReactElement, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name?: string;
};

export const iconAliases: Record<string, string> = {
  admin_panel_settings: "shield",
  account_circle: "user",
  person: "user",
  lock: "lock",
  dashboard: "dashboard",
  link: "link",
  category: "category",
  settings: "settings",
  open_in_new: "external",
  logout: "logout",
  light_mode: "sun",
  dark_mode: "moon",
  desktop_windows: "desktop",
  language: "language",
  palette: "palette",
  save: "save",
  upload: "upload",
  search: "search",
  add: "plus",
  drag_indicator: "drag",
  edit: "edit",
  delete: "trash",
  close: "close",
  bar_chart: "chart",
  visibility: "eye",
  public: "globe",
  home: "home",
  email: "mail",
  mail: "mail",
  phone: "phone",
  work: "briefcase",
  code: "code",
  terminal: "code",
  article: "file",
  folder: "folder",
  star: "star",
  favorite: "heart",
  rocket_launch: "rocket",
  analytics: "chart"
  ,github: "github"
  ,telegram: "telegram"
  ,send: "telegram"
  ,wechat: "wechat"
  ,weixin: "wechat"
  ,twitter: "x"
  ,x: "x"
  ,qq: "qq"
  ,discord: "discord"
  ,blog: "rss"
  ,rss_feed: "rss"
  ,rss: "rss"
  ,forum: "discord"
  ,chat: "wechat"
  ,alternate_email: "x"
  ,mode_comment: "qq"
  ,collections: "image"
  ,browser_updated: "browser"
  ,javascript: "code"
  ,css: "code"
  ,psychology: "brain"
  ,smart_toy: "bot"
  ,draw: "palette"
  ,book: "book"
  ,build: "settings"
  ,brush: "palette"
  ,travel_explore: "globe"
};

export const socialIconNames = [
  "mail",
  "github",
  "telegram",
  "wechat",
  "qq",
  "x",
  "discord",
  "rss",
  "phone"
];

export const iconNames = [
  "shield",
  "user",
  "lock",
  "dashboard",
  "link",
  "category",
  "settings",
  "external",
  "logout",
  "sun",
  "moon",
  "desktop",
  "language",
  "palette",
  "save",
  "upload",
  "search",
  "plus",
  "drag",
  "edit",
  "trash",
  "close",
  "chart",
  "eye",
  "globe",
  "home",
  "mail",
  "phone",
  "briefcase",
  "code",
  "file",
  "folder",
  "star",
  "heart",
  "rocket",
  "github",
  "telegram",
  "wechat",
  "x",
  "qq",
  "discord",
  "rss",
  "image",
  "browser",
  "brain",
  "bot",
  "book",
  ...Object.keys(iconAliases)
];

const paths: Record<string, ReactElement> = {
  shield: <path d="M12 3l7 3v5c0 4.2-2.7 8-7 10-4.3-2-7-5.8-7-10V6l7-3zm0 4v10m-4-5h8" />,
  user: <path d="M20 21a8 8 0 0 0-16 0m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  lock: <path d="M7 11V8a5 5 0 0 1 10 0v3m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" />,
  dashboard: <path d="M4 5h7v7H4zM13 5h7v4h-7zM13 11h7v8h-7zM4 14h7v5H4z" />,
  link: <path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1m3.1 6a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1" />,
  category: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  settings: <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.5 4a8.5 8.5 0 0 0-.1-1.2l2-1.5-2-3.5-2.4 1a8.5 8.5 0 0 0-2-1.2L15.7 3h-4l-.4 2.6a8.5 8.5 0 0 0-2 1.2l-2.4-1-2 3.5 2 1.5A8.5 8.5 0 0 0 6.8 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-1a8.5 8.5 0 0 0 2 1.2l.4 2.6h4l.4-2.6a8.5 8.5 0 0 0 2-1.2l2.4 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" />,
  external: <path d="M14 4h6v6m0-6L10 14m-2-8H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" />,
  logout: <path d="M10 17l5-5-5-5m5 5H3m7 8h8a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-8" />,
  sun: <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.4-6.4l1.4-1.4M4.2 19.8l1.4-1.4m12.8 0l1.4 1.4M4.2 4.2l1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  moon: <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />,
  desktop: <path d="M4 5h16v11H4zM8 21h8m-4-5v5" />,
  language: <path d="M4 5h9M9 3v2m1 0c-.7 3.8-2.7 6.7-6 9m2-6c1.3 2 3 3.7 5 5m3 8l5-11 5 11m-2-4h-6" />,
  palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 1.4-3.4 1.5 1.5 0 0 1 1.1-2.6h1A5 5 0 0 0 17 5.5 8.9 8.9 0 0 0 12 3zM7.5 10h.01M10 7h.01M14 7h.01M16.5 10h.01" />,
  save: <path d="M5 4h12l2 2v14H5zM8 4v6h8V4M8 20v-6h8v6" />,
  upload: <path d="M12 16V4m0 0l-5 5m5-5l5 5M4 20h16" />,
  search: <path d="M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm4.5 10.5L21 21" />,
  plus: <path d="M12 5v14M5 12h14" />,
  drag: <path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" />,
  edit: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4zM13 7l4 4" />,
  trash: <path d="M4 7h16M9 7V5h6v2m-8 0l1 14h8l1-14" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chart: <path d="M4 19V5m0 14h16M8 16v-5m4 5V8m4 8v-9" />,
  eye: <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />,
  globe: <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0c2.5 2.4 3.8 5.4 3.8 9S14.5 18.6 12 21m0-18c-2.5 2.4-3.8 5.4-3.8 9s1.3 6.6 3.8 9M3 12h18" />,
  home: <path d="M3 11l9-8 9 8m-16 0v10h14V11" />,
  mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
  phone: <path d="M6 4h4l2 5-3 2a12 12 0 0 0 4 4l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z" />,
  briefcase: <path d="M10 6V4h4v2m-9 0h14v13H5zM5 11h14" />,
  code: <path d="M8 9l-4 3 4 3m8-6l4 3-4 3m-2-8l-4 10" />,
  file: <path d="M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6" />,
  folder: <path d="M3 6h7l2 2h9v11H3z" />,
  star: <path d="M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9z" />,
  heart: <path d="M20.8 6.6a5 5 0 0 0-7.1 0L12 8.3l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 22l8.8-8.3a5 5 0 0 0 0-7.1z" />,
  rocket: <path d="M5 19c2-5 5-9 10-12l4-2-2 4c-3 5-7 8-12 10zm4-4l-4 4m10-10l4-4M7 17l-2 4 4-2m6-10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  ,github: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.8 12.8 0 0 0-6.7 0C6.7 1.4 5.6 1.7 5.6 1.7a4.8 4.8 0 0 0-.1 3.6 5.1 5.1 0 0 0-1.4 3.6c0 5.1 3.1 6.3 6.1 6.6a3.4 3.4 0 0 0-1 2.6V22" />
  ,telegram: <path d="M21 4L3 11.2l6.8 2.1M21 4l-3.2 16-8-6.7M21 4 9.8 13.3M9.8 13.3 8.8 19l3.2-3" />
  ,wechat: <path d="M9.5 6C5.9 6 3 8.3 3 11.2c0 1.7 1 3.2 2.6 4.2L5 18l2.8-1.4c.6.1 1.1.2 1.7.2 3.6 0 6.5-2.3 6.5-5.2S13.1 6 9.5 6zm-2.2 4.2h.01m4.4 0h.01M15 12.5c3.3.2 6 2.3 6 4.9 0 1.5-.9 2.8-2.3 3.7l.5 2.1-2.5-1.2c-.5.1-1 .2-1.6.2-2.7 0-5-1.5-5.8-3.6" />
  ,x: <path d="M4 4l16 16M20 4 4 20M8.2 4h3.1l4.5 6.4M15.8 20h-3.1l-4.5-6.4" />
  ,qq: <path d="M12 3c-2.8 0-5 2.5-5 6.2 0 1.7.5 3.1 1.2 4.2L6 18.5l4.2-1.2c.6.2 1.2.3 1.8.3s1.2-.1 1.8-.3l4.2 1.2-2.2-5.1c.7-1.1 1.2-2.5 1.2-4.2C17 5.5 14.8 3 12 3zm-2 7h.01M14 10h.01M9 14c1.7 1.2 4.3 1.2 6 0" />
  ,discord: <path d="M8 8c2.7-1 5.3-1 8 0l1.2 8.5c-1.5 1.1-3 1.8-4.7 2l-.7-1.4c-1.2.2-2.4.2-3.6 0l-.7 1.4c-1.7-.2-3.2-.9-4.7-2L4 8c1-.8 2-1.3 3.2-1.7L8 8zm1 5h.01M15 13h.01M9 16c2 .7 4 .7 6 0" />
  ,rss: <path d="M5 19h.01M4 4a16 16 0 0 1 16 16M4 10a10 10 0 0 1 10 10M4 15a5 5 0 0 1 5 5" />
  ,image: <path d="M4 5h16v14H4zM8 10h.01M4 16l4-4 4 4 3-3 5 5" />
  ,browser: <path d="M4 5h16v14H4zM4 9h16M8 7h.01M11 7h.01M14 7h.01" />
  ,brain: <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.8V16a3 3 0 0 0 4 2.8V4zm6 0a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.8V16a3 3 0 0 1-4 2.8V4zM9 8H7m2 5H6m9-5h2m-2 5h3" />
  ,bot: <path d="M12 5V3m-6 7a6 6 0 0 1 12 0v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-6zm3 2h.01M15 12h.01M9 16h6M4 13H2m20 0h-2" />
  ,book: <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4zm0 0v19m4-15h6m-6 4h6" />
};

export function resolveIconName(name = "link") {
  return iconAliases[name] || name;
}

export function hasIcon(name = "link") {
  return Boolean(paths[resolveIconName(name)]);
}

export function Icon({ name = "link", className = "", ...props }: IconProps) {
  const key = resolveIconName(name);
  const path = paths[key] || paths.link;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`inline-block h-[1em] w-[1em] shrink-0 ${className}`}
      {...props}
    >
      {path}
    </svg>
  );
}

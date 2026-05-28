import type { ReactElement, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  name?: string;
};

const aliases: Record<string, string> = {
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
};

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
};

export function Icon({ name = "link", className = "", ...props }: IconProps) {
  const key = aliases[name] || name;
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

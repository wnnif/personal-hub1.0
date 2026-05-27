create table "profile_settings" (
  "id" text primary key default 'main',
  "name" text not null,
  "bio" text not null,
  "avatar_url" text not null,
  "footer_text" text not null,
  "updated_at" timestamp(3) not null
);

create table "site_settings" (
  "id" text primary key default 'main',
  "site_title" text not null,
  "seo_description" text not null,
  "default_theme" text not null default 'system',
  "analytics_id" text not null default '',
  "updated_at" timestamp(3) not null
);

create table "categories" (
  "id" text primary key,
  "name" text not null,
  "icon" text not null default 'category',
  "sort_order" integer not null default 0,
  "is_active" boolean not null default true,
  "created_at" timestamp(3) not null default current_timestamp,
  "updated_at" timestamp(3) not null
);

create table "portal_links" (
  "id" text primary key,
  "title" text not null,
  "description" text not null default '',
  "url" text not null,
  "icon" text not null default 'link',
  "category_id" text,
  "sort_order" integer not null default 0,
  "is_active" boolean not null default true,
  "created_at" timestamp(3) not null default current_timestamp,
  "updated_at" timestamp(3) not null,
  constraint "portal_links_category_id_fkey" foreign key ("category_id") references "categories"("id") on delete set null on update cascade
);

create table "social_links" (
  "id" text primary key,
  "label" text not null,
  "icon" text not null default 'link',
  "url" text not null,
  "sort_order" integer not null default 0,
  "is_active" boolean not null default true
);

create table "featured_links" (
  "id" text primary key,
  "label" text not null,
  "icon" text not null default 'link',
  "hint" text not null default '',
  "url" text not null,
  "sort_order" integer not null default 0,
  "is_active" boolean not null default true
);

create table "visit_stats" (
  "id" text primary key,
  "date" text not null unique,
  "visitors" integer not null default 0,
  "updated_at" timestamp(3) not null
);

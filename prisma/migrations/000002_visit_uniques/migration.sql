create table "visit_uniques" (
  "id" text primary key,
  "date" text not null,
  "ip_hash" text not null,
  "created_at" timestamp(3) not null default current_timestamp,
  constraint "visit_uniques_date_fkey" foreign key ("date") references "visit_stats"("date") on delete cascade on update cascade
);

create unique index "visit_uniques_date_ip_hash_key" on "visit_uniques"("date", "ip_hash");

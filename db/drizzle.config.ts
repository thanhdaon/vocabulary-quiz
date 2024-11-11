import { defineConfig } from "drizzle-kit";
import { env } from "~/lib/env";

export default defineConfig({
  schema: "db/schema.ts",
  out: "db/drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: env.DB_URL,
  },
});

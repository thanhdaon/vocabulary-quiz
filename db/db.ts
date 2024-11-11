import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "~/lib/env";
import * as schema from "~/db/schema";

export const db = drizzle({
  connection: env.DB_URL,
  schema,
  casing: "snake_case",
});

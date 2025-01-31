import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_URL: z.string().url(),
  },
  runtimeEnv: {
    DB_URL: process.env.DB_URL,
  },
});

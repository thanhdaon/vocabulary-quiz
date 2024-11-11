import { db } from "~/db/db";
import { pusher } from "~/lib/soketi";

export async function createContext() {
  return { db, pusher };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { db } from "~/db/db";
import { pusher } from "~/lib/soketi";
import { appRouter } from "~/trpc/routes";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => {
      return { db, pusher };
    },
  });

export { handler as GET, handler as POST };

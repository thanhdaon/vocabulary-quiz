import { createRouter } from "~/trpc/trpc";
import { quizRouter as quiz } from "~/trpc/routes/quiz";
import { pusherRouter as pusher } from "~/trpc/routes/pusher";

export const appRouter = createRouter({
  quiz,
  pusher,
});

export type AppRouter = typeof appRouter;

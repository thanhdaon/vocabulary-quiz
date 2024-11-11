import { z } from "zod";
import { createRouter, publicProcedure } from "~/trpc/trpc";

export const pusherRouter = createRouter({
  sendEvent: publicProcedure
    .input(
      z.object({
        channelName: z.string(),
        eventName: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.pusher.trigger(input.channelName, input.eventName, input.data);
    }),
});

import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { participants, quizzes } from "~/db/schema";
import { createRouter, publicProcedure } from "~/trpc/trpc";

export const quizRouter = createRouter({
  join: publicProcedure
    .input(
      z.object({
        quizId: z.coerce.number(),
        displayName: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(quizzes)
        .values({ id: input.quizId })
        .onConflictDoNothing();

      const displaynameCount = await ctx.db.$count(
        participants,
        eq(participants.displayName, input.displayName)
      );

      if (displaynameCount > 0) {
        throw new Error("Display name already exists");
      }

      const [{ participantId }] = await ctx.db
        .insert(participants)
        .values({
          displayName: input.displayName,
          quizId: input.quizId,
          avatar: faker.image.urlPicsumPhotos({
            width: 50,
            height: 50,
            blur: 0,
          }),
        })
        .returning({ participantId: participants.id });

      return { participantId };
    }),
});

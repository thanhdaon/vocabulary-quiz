import { eq } from "drizzle-orm";
import { db } from "~/db/db";
import { participants } from "~/db/schema";
import { pusher } from "~/lib/soketi";

export async function POST(request: Request) {
  try {
    const webhook = pusher.webhook({
      rawBody: await request.text(),
      headers: Object.fromEntries(request.headers),
    });
    const events = webhook.getEvents();

    for (const e of events) {
      if (e.name === "member_removed") {
        await db
          .delete(participants)
          .where(eq(participants.soketiUserId, e.user_id));
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  } finally {
    return new Response("OK", { status: 200 });
  }
}

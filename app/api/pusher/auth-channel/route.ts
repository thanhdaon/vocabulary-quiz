import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "~/db/db";
import { participants } from "~/db/schema";
import { pusher } from "~/lib/soketi";

export async function POST(request: Request) {
  const formdata = await request.formData();

  const socketId = formdata.get("socket_id");
  if (socketId === null) {
    throw new Error("socket-id is empty!");
  }

  const channel = formdata.get("channel_name");
  if (channel === null) {
    throw new Error("channel-name is empty!");
  }

  const participantId = formdata.get("participant_id");
  if (participantId === null) {
    throw new Error("participant id is empty!");
  }

  const auth = await authorize(
    socketId.toString(),
    channel.toString(),
    participantId.toString()
  );
  return NextResponse.json(auth);
}

async function authorize(
  socketId: string,
  channel: string,
  participantId: string
) {
  const participant = await db.query.participants.findFirst({
    where(fields, { eq }) {
      return eq(fields.id, parseInt(participantId, 10));
    },
  });

  if (participant === undefined) {
    throw new Error("participant not found");
  }

  if (channel.includes("presence")) {
    const userUUID = faker.string.nanoid();

    await db
      .update(participants)
      .set({
        soketiUserId: userUUID,
      })
      .where(eq(participants.id, parseInt(participantId, 10)));

    return pusher.authorizeChannel(socketId, channel, {
      user_id: userUUID,
      user_info: {
        participantId: participant.id,
        displayName: participant.displayName,
        avatar: participant.avatar,
      },
    });
  }

  return pusher.authorizeChannel(socketId, channel);
}

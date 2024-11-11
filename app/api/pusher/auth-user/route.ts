import { faker } from "@faker-js/faker";
import { NextResponse } from "next/server";
import { pusher } from "~/lib/soketi";

export async function POST(request: Request) {
  const formdata = await request.formData();

  const socketId = formdata.get("socket_id");
  if (socketId === null) {
    throw new Error("socket-id is empty!");
  }

  const user = {
    id: faker.string.nanoid(),
  };

  const auth = pusher.authenticateUser(socketId.toString(), user);

  return NextResponse.json(auth);
}

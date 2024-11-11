import Pusher from "pusher";
import PusherClient from "pusher-js";

export const pusher = new Pusher({
  host: "localhost",
  port: "6001",
  appId: "soketi",
  key: "soketi",
  secret: "soketi",
  useTLS: false,
});

export function createPusherClient({
  participantId,
}: {
  participantId: number;
}) {
  return new PusherClient("soketi", {
    wsHost: "localhost",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ["ws", "wss"],
    channelAuthorization: {
      transport: "ajax",
      endpoint: "/api/pusher/auth-channel",
      params: { participant_id: participantId },
    },
    userAuthentication: {
      transport: "ajax",
      endpoint: "/api/pusher/auth-user",
    },
  });
}

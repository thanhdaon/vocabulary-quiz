import { Channel, PresenceChannel } from "pusher-js";

import { useEffect } from "react";

export function useEvent<D>(
  channel: Channel | PresenceChannel | undefined,
  eventName: string,
  callback: (data?: D, metadata?: { user_id: string }) => void
) {
  useEffect(() => {
    if (eventName === "") {
      console.error("Must supply eventName and callback to onEvent!");
    }

    if (channel === undefined || eventName === "") {
      return;
    }

    channel.bind(eventName, callback);

    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}

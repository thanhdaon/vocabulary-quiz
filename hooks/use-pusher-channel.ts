import { type Channel, type PresenceChannel } from "pusher-js";
import { useContext, useEffect, useState } from "react";
import { ChannelsContext } from "~/components/provider-pusher";

export function useChannel<T extends Channel & PresenceChannel>(
  channelName: string
) {
  const [channel, setChannel] = useState<Channel & PresenceChannel>();
  const channels = useContext(ChannelsContext);

  if (channels === null) {
    throw new Error("use-channel is using outside provider");
  }

  useEffect(() => {
    if (channelName === "") {
      return;
    }

    setChannel(channels.subscribe<T>(channelName));

    return () => {
      channels.unsubscribe(channelName);
    };
  }, [channelName, channels]);

  return channel;
}

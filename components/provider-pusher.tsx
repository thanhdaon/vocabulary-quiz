"use client";

import PusherClient, { type Channel, type PresenceChannel } from "pusher-js";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { createPusherClient } from "~/lib/soketi";

interface ChannelsCtxValues {
  subscribe: <T extends Channel & PresenceChannel>(
    channelName: string
  ) => T | undefined;
  getChannel: <T extends Channel & PresenceChannel>(
    channelName: string
  ) => T | undefined;
  unsubscribe: (channelName: string) => void;
}

interface PusherCtxValues {
  client: PusherClient;
  isSignedIn: boolean;
}

type AcceptedChannels = Channel | PresenceChannel;

type ConnectedChannels = {
  [channelName: string]: AcceptedChannels[];
};

export const PusherContext = createContext<PusherCtxValues | null>(null);
export const ChannelsContext = createContext<ChannelsCtxValues | null>(null);

interface ProviderProps {
  children: ReactNode;
  participantId: number;
}

export function PusherProvider({ children, participantId }: ProviderProps) {
  const [pusherClient] = useState(createPusherClient({ participantId }));
  const [connectedChannels] = useState<ConnectedChannels>({});
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    pusherClient.signin();

    pusherClient.bind_global((event: string) => {
      if (event === "pusher:signin_success") {
        setIsSignedIn(true);
      }
    });

    return () => {
      pusherClient.unbind_all();
    };
  }, [pusherClient]);

  const subscribe = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      if (channelName === "") {
        return;
      }

      const channel = pusherClient.subscribe(channelName);

      connectedChannels[channelName] = [
        ...(connectedChannels[channelName] || []),
        channel,
      ];

      return channel as T;
    },
    [connectedChannels, pusherClient]
  );

  const unsubscribe = useCallback(
    (channelName: string) => {
      if (!channelName || !(channelName in connectedChannels)) {
        return;
      }
      if (connectedChannels[channelName].length === 1) {
        pusherClient.unsubscribe(channelName);
        delete connectedChannels[channelName];
      } else {
        connectedChannels[channelName].pop();
      }
    },
    [connectedChannels, pusherClient]
  );

  const getChannel = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      if (!channelName || !(channelName in connectedChannels)) {
        return;
      }
      return connectedChannels[channelName][0] as T;
    },
    [connectedChannels]
  );

  return (
    <PusherContext.Provider value={{ client: pusherClient, isSignedIn }}>
      <ChannelsContext.Provider value={{ unsubscribe, subscribe, getChannel }}>
        {children}
      </ChannelsContext.Provider>
    </PusherContext.Provider>
  );
}

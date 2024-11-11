import { Members, PresenceChannel } from "pusher-js";
import { useEffect, useReducer } from "react";
import { useChannel } from "~/hooks/use-pusher-channel";

type PresenceChannelState = {
  members: Record<string, any>;
  me: Record<string, any> | undefined;
  myID: string | undefined;
  count: number;
};

type MemberAction = { id: string; info?: Record<string, any> };

type ReducerAction = {
  type: typeof SET_STATE | typeof ADD_MEMBER | typeof REMOVE_MEMBER;
  payload: Partial<PresenceChannelState> | MemberAction;
};

interface usePresenceChannelValue extends Partial<PresenceChannelState> {
  channel?: PresenceChannel;
}

const SET_STATE = "set-state";
const ADD_MEMBER = "add-member";
const REMOVE_MEMBER = "remove-member";

const presenceChannelReducer = (
  state: PresenceChannelState,
  { type, payload }: ReducerAction
) => {
  switch (type) {
    case SET_STATE:
      return { ...state, ...payload };
    case ADD_MEMBER:
      const { id: addedMemberId, info } = payload as MemberAction;
      return {
        ...state,
        count: state.count + 1,
        members: {
          ...state.members,
          [addedMemberId]: info,
        },
      };
    case REMOVE_MEMBER:
      const { id: removedMemberId } = payload as MemberAction;
      const members = { ...state.members };
      delete members[removedMemberId];
      return {
        ...state,
        count: state.count - 1,
        members: {
          ...members,
        },
      };
  }
};

export function usePresenceChannel(
  channelName: string
): usePresenceChannelValue {
  if (channelName) {
    if (!channelName.includes("presence-")) {
      throw new Error(
        "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
      );
    }
  }

  const [state, dispatch] = useReducer(presenceChannelReducer, {
    members: {},
    me: undefined,
    myID: undefined,
    count: 0,
  });

  // bind and unbind member events events on our channel
  const channel = useChannel<PresenceChannel>(channelName);
  useEffect(() => {
    if (channel) {
      // Get membership info on successful subscription
      const handleSubscriptionSuccess = (members: Members) => {
        dispatch({
          type: SET_STATE,
          payload: {
            members: members.members,
            myID: members.myID,
            me: members.me,
            count: Object.keys(members.members).length,
          },
        });
      };

      // Add member to the members object
      const handleAdd = (member: any) => {
        dispatch({
          type: ADD_MEMBER,
          payload: member,
        });
      };

      // Remove member from the members object
      const handleRemove = (member: any) => {
        dispatch({
          type: REMOVE_MEMBER,
          payload: member,
        });
      };

      // bind to all member addition/removal events
      channel.bind("pusher:subscription_succeeded", handleSubscriptionSuccess);
      channel.bind("pusher:member_added", handleAdd);
      channel.bind("pusher:member_removed", handleRemove);

      // cleanup
      return () => {
        channel.unbind(
          "pusher:subscription_succeeded",
          handleSubscriptionSuccess
        );
        channel.unbind("pusher:member_added", handleAdd);
        channel.unbind("pusher:member_removed", handleRemove);
      };
    }

    // to make typescript happy.
    return () => {};
  }, [channel]);

  return {
    channel,
    ...state,
  };
}

import { useContext } from "react";
import { PusherContext } from "~/components/provider-pusher";

export function usePusher() {
  const pusher = useContext(PusherContext);

  if (pusher === null) {
    throw new Error("pusher hook is using outside context");
  }

  return pusher;
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePresenceChannel } from "~/hooks/use-pusher-presence-channel";

export function Participants({ quizId }: { quizId: number }) {
  const { members, me, count } = usePresenceChannel(`presence-quiz@${quizId}`);

  if (members === undefined || me === undefined) {
    return <div>Session ended</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants ({count} members)</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-2 gap-4">
          {Object.entries(members).map(([id, member]) => (
            <li key={id} className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>{member.displayName.at(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{member.displayName}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

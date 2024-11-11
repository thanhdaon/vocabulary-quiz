import Link from "next/link";
import { notFound } from "next/navigation";
import { Participants } from "~/components/participants";
import { PusherProvider } from "~/components/provider-pusher";
import { buttonVariants } from "~/components/ui/button";

interface Props {
  params: { quizId?: string };
  searchParams: { participantId?: string };
}

export default async function QuizPage({ params, searchParams }: Props) {
  if (!params.quizId || !searchParams.participantId) {
    return notFound();
  }

  const participantId = parseInt(searchParams.participantId, 10);
  const quizId = parseInt(params.quizId, 10);

  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col gap-4">
        <PusherProvider participantId={participantId}>
          <Participants quizId={quizId} />
        </PusherProvider>
        <Link href="/" className={buttonVariants()}>
          Leave Quiz
        </Link>
      </div>
    </div>
  );
}

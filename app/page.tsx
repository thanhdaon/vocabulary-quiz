import { JoinQuiz } from "~/components/join-quiz";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Real-Time Quiz</h1>
      <div className="grid place-items-center">
        <JoinQuiz />
      </div>
    </div>
  );
}

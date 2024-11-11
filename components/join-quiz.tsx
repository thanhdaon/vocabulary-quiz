"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/client";

const FormSchema = z.object({
  quizId: z.coerce.number().gt(0),
  displayName: z.string().min(1),
});

export function JoinQuiz() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const join = api.quiz.join.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data, variables) {
      toast.info("Join quiz success");
      router.push(`/${variables.quizId}?participantId=${data.participantId}`);
    },
    onMutate() {
      toast.loading("Joining quiz");
    },
    onSettled() {
      toast.dismiss();
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    join.mutate({ quizId: data.quizId, displayName: data.displayName });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quizId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter Quiz ID"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Enter your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Join Quiz
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

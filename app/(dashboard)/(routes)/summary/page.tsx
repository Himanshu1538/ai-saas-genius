"use client";

import React, { useState } from "react";
import { NotebookText } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
// import { ChatCompletionRequestMessage } from "openai";
import { toast } from "react-hot-toast";

import Heading from "@/components/heading";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";

import { cn } from "@/lib/utils";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

interface Messages {
  role: string;
  content: string;
}

const SummaryPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  // const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // const userMessage: ChatCompletionRequestMessage = {
      //   role: "user",
      //   content: values.prompt,
      // };
      const userMessage = {
        role: "user",
        content: values.prompt,
      };

      // const userMessage = values.prompt;

      const newMessages = [...messages, userMessage];
      // const newMessages = userMessage;
      const response = await axios.post("/api/summary", {
        messages: newMessages,
      });
      // setMessages((current) => [...current, userMessage, response.data]);
      console.log("Summary Model Response", response.data);
      setMessages((current) => [
        ...current,
        userMessage,
        {
          role: "bot",
          content: response.data,
        },
      ]);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) proModal.onOpen();
      else toast.error("Something went wrong.");
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Summary Generation"
        description="Our Most Advanced And Consice Text Summarizer Model"
        icon={NotebookText}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        disabled={isLoading}
                        placeholder="Enter or paste your text here..."
                        className="pl-2 border-0 outline-none focus-visible:ring-0 focus-visible: ring-transparent"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="col-span-12 lg:col-span-2 w-full"
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-2">
          {isLoading && (
            <div className="p-8 mt-4 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation Started Yet." />
          )}
          <div className="flex flex-col-reverse gap-y-4 mt-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <ReactMarkdown className="text-sm overflow-hidden leading-7">
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;

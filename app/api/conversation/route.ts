import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AiChatSession } from "./config";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

// Handler function for POST requests to the /api/conversation endpoint
export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = auth();

    // Parse the request body and extreact messages
    const body = await req.json();
    const { messages } = body;

    // Check if the user is authenticated
    if (!userId) return new NextResponse("UnAuthorized", { status: 401 });

    // Check if messages are provided
    if (!messages)
      return new NextResponse("Messages Are Required", { status: 400 });

    // Check the user's API usage limits and subscription status
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    // If the user has exceeded the free trial and is not a pro subscriber, return an error with 403 status
    if (!freeTrial && !isPro)
      return new NextResponse("Free Trial Has Expired", { status: 403 });

    // console.log("body", body);
    // console.log("Messages", messages);

    // Send the messages to the AI chat session and get the response
    const result = await AiChatSession.sendMessage([...messages.pop().content]);
    // console.log("Conversation API response", result.response.text());

    // If the user is not a pro subscriber, increase the API usage count
    if (!isPro) await increaseApiLimit();

    // Return the AI response as JSON
    return NextResponse.json(result.response.text());
  } catch (error) {
    // Handle errors
    // console.error("[CONVERSATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

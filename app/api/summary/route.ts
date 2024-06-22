import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { AiChatSession } from "./config";

import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) return new NextResponse("UnAuthorized", { status: 401 });

    if (!messages)
      return new NextResponse("Messages Are Required", { status: 400 });

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro)
      return new NextResponse("Free Trial Has Expired", { status: 403 });

    console.log("body", body);
    console.log("Messages", messages);

    const result = await AiChatSession.sendMessage([...messages.pop().content]);
    console.log("Summary API response", result.response.text());

    if (!isPro) await increaseApiLimit();

    return NextResponse.json(result.response.text());
  } catch (error) {
    console.error("[SUMMARY_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

import ChatPage from "@/components/chat/chat-page";

export const metadata = { title: "Chat · NexaAI" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; new?: string; tpl?: string }>;
}) {
  const sp = await searchParams;
  return <ChatPage initialChatId={sp.c ?? null} newChat={sp.new === "1"} tplId={sp.tpl ?? null} />;
}
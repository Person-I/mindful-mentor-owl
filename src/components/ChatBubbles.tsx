
import React from "react";
import { Message } from "@/types/talk";
import { cn } from "@/lib/utils";

interface ChatBubblesProps {
  messages: Message[];
}

const ChatBubbles: React.FC<ChatBubblesProps> = ({ messages }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 glass rounded-lg p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "assistant" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                message.role === "assistant"
                  ? "bg-secondary text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <div
                className={cn(
                  "text-xs mt-1",
                  message.role === "assistant"
                    ? "text-foreground/60"
                    : "text-primary-foreground/80"
                )}
              >
                {formatDate(message.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBubbles;

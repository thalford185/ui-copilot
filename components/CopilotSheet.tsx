import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "ai/react";
import { Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage";

interface CopilotSheetProps {
  getComponentScreenshotUrl: () => Promise<string | null>;
  content: string;
  updateContent: (content: string) => void;
}

export default function CopilotSheet({
  getComponentScreenshotUrl,
  content,
  updateContent,
}: CopilotSheetProps) {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      api: "/api/copilot",
      maxToolRoundtrips: 3,
      onToolCall: ({ toolCall }) => {
        if (toolCall.toolName == "updateCode") {
          const toolCallArgs = toolCall.args as { code: string };
          if (toolCallArgs.code) {
            updateContent(toolCallArgs.code);
            fetch("/api/editor", {
              method: "PUT",
              body: toolCallArgs.code,
            });
          }
        }
      },
    });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-8 right-8 bg-purple-700 p-4 rounded-full shadow-md">
          <Sparkles color="white"></Sparkles>
        </button>
      </SheetTrigger>
      <SheetContent className="min-w-[75%] overflow-y-scroll">
        <SheetHeader>
          <SheetTitle>UI Copilot</SheetTitle>
          <SheetDescription>Use AI to fix design issues</SheetDescription>
        </SheetHeader>
        {messages.map((message) => {
          return (
            <ChatMessage key={message.id} message={message} content={content} />
          );
        })}
        <SheetFooter className="mt-8">
          <form
            className="w-full"
            onSubmit={async (event) => {
              event.preventDefault();
              const componentScreenshotUrl = await getComponentScreenshotUrl();
              const attachments =
                componentScreenshotUrl === null
                  ? undefined
                  : [
                      {
                        contentType: "image/png",
                        url: componentScreenshotUrl,
                        name: "component-screenshot.png",
                      },
                    ];
              handleSubmit(event, {
                experimental_attachments: attachments,
              });
            }}
          >
            <div className="grid w-1/2 mx-auto gap-2">
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message here."
              ></Textarea>
              <Button type="submit" disabled={isLoading}>
                Send message
              </Button>
            </div>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

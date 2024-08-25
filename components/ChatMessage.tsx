import { Message } from "ai";
import { Badge } from "@/components/ui/badge";
import DiffEditor from "./DiffEditor";
import { Save } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChatMessageProps {
  message: Message;
  content: string;
}
export default function ChatMessage({ message, content }: ChatMessageProps) {
  const roleSpecificClassName =
    message.role === "user" ? "ml-auto bg-gray-100" : "mr-auto bg-purple-100";
  return (
    <div>
      {message.content && (
        <div
          className={`${roleSpecificClassName} rounded-xl p-8 max-w-xl mt-4`}
        >
          {message.content}
          <div className="mt-4">
            {message.experimental_attachments?.map((attachment, index) => (
              <Badge key={attachment.name}>{attachment.name}</Badge>
            ))}
          </div>
        </div>
      )}
      {message.toolInvocations?.map((toolInvocation) => {
        if (toolInvocation.toolName == "showCodePreview") {
          return (
            <div key={toolInvocation.toolCallId} className="mt-4 h-72">
              <DiffEditor
                originalContent={content}
                newContent={toolInvocation.args.code}
              />
            </div>
          );
        }
        if (toolInvocation.toolName == "updateCode") {
          return (
            <div key={toolInvocation.toolCallId} className="mt-4">
              <Alert>
                <Save />
                <AlertTitle>Code updated</AlertTitle>
                <AlertDescription>
                  The component code has been updated and the issue should be
                  fixed
                </AlertDescription>
              </Alert>
            </div>
          );
        }
      })}
    </div>
  );
}

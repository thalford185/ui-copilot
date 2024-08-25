import { getComponentSource } from "@/lib/adapters/component-source";
import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const componentSource = await getComponentSource();
  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages).filter(
      (message) => message.content
    ),
    system: `
      You are a copilot who assists in identifying and fixing design issues with web components.
      The web components are written in react with typescript and are styled using tailwindcss.
    
      Instructions:
      1. When you find an issue, ask the user if they want to see the code changes.
      2. If the user says yes, show the code changes. Do not display code in the message, show a code preview instead.
      3. After showing the code changes, ask the user if they accept the code changes without showing a code preview again.
      4. If the user accepts the code changes then update the code and let the user know.

      <component-source>
        ${componentSource}
      </component-source>
      `,
    tools: {
      showCodePreview: {
        description: "show a preview of the web component code",
        parameters: z.object({ code: z.string() }),
        execute: async ({}: { code: string }) => {
          return null;
        },
      },
      updateCode: {
        description: "update the web component code",
        parameters: z.object({ code: z.string() }),
        execute: async ({}: { code: string }) => {
          return null;
        },
      },
    },
  });

  return result.toDataStreamResponse();
}

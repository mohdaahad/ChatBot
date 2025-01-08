"use client";

import { useEdgeRuntime } from "@assistant-ui/react";
import {
  Thread,
  CompositeAttachmentAdapter,
  SimpleImageAttachmentAdapter,
  SimpleTextAttachmentAdapter,
} from "@assistant-ui/react";
import { makeMarkdownText } from "@assistant-ui/react-markdown";
import { WebSpeechSynthesisAdapter } from "@assistant-ui/react";

const MarkdownText = makeMarkdownText();

export function MyAssistant() {
  const runtime = useEdgeRuntime({
    api: "/api/chat",
    
    adapters: {
      attachments: new CompositeAttachmentAdapter([
        new SimpleImageAttachmentAdapter(),
        new SimpleTextAttachmentAdapter(),
      ]),
      speech: new WebSpeechSynthesisAdapter(),
    },
  });

  return (
    <>
      <Thread
        runtime={runtime}
        assistantMessage={{ components: { Text: MarkdownText } }}
        welcome={{
          suggestions: [
            {
              text: "Find the best online coaching for NEET preparation.",
              prompt: "Find the best online coaching for NEET preparation.",
            },
            {
              text: "What are the key topics to focus on for IIT JEE?",
              prompt: "What are the key topics to focus on for IIT JEE?",
            },
          ],
        }}
      />
    </>
  );
}




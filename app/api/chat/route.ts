import { azure } from "@ai-sdk/azure";
import { getEdgeRuntimeResponse } from "@assistant-ui/react/edge";


export const POST = async (request: Request) => {
  const requestData = await request.json();
  const systemMessage = {
    role: "system",
    content: [{
      type: 'text',
      text:  process.env.AI_SYSTEM_MESSAGE
    }]
  };
  requestData.messages.unshift(systemMessage);

  return getEdgeRuntimeResponse({
    options: {
      model: azure("gpt-4o"),
    },
    requestData,
    abortSignal: request.signal,
  });
};

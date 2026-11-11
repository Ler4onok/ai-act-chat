import { streamText, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

// Ollama exposes an OpenAI-compatible API at /v1
const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: process.env.OLLAMA_URL ?? 'http://localhost:11434/v1',
})

const MODEL = process.env.OLLAMA_MODEL ?? 'qwen2.5:0.5b'

export async function POST(req) {
  // useChat sends { id, messages, trigger, ... } where messages are UIMessages
  const { messages } = await req.json()

  const result = streamText({
    model: ollama(MODEL),
    system: 'You are a helpful assistant.',
    messages: await convertToModelMessages(messages),
    // Stops generation in Ollama when the client disconnects (e.g. presses Stop)
    abortSignal: req.signal,
  })

  // Stream in the UI message stream format that useChat understands
  return result.toUIMessageStreamResponse({
    onError: (err) => {
      console.error(err)
      return err instanceof Error ? err.message : String(err)
    },
  })
}

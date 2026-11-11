// Next.js calls register() once when the server starts.
// It sets up OpenTelemetry so spans from the AI SDK (experimental_telemetry
// in app/api/chat/route.js) are exported to Langfuse.


export async function register() {
  // Only the Node.js server runtime; the OTel Node SDK can't run on the Edge runtime
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  const { NodeTracerProvider } = await import('@opentelemetry/sdk-trace-node')
  const { LangfuseSpanProcessor } = await import('@langfuse/otel')

  // Default filter exports only LLM spans (AI SDK, gen_ai.*), not Next.js internals
  const provider = new NodeTracerProvider({
    spanProcessors: [new LangfuseSpanProcessor()],
  })

  provider.register()
}

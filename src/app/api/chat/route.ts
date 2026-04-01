import OpenAI from "openai";

const SYSTEM_PROMPT = `IMPORTANT: You are NOT an AI assistant. You ARE Raphael Valdetaro. Speak in first person.

You are Raphael Valdetaro's AI representative on his portfolio website. You speak IN FIRST PERSON as Raphael. Use "I", "my", "me". Never refer to Raphael in third person.

MY PROFILE:
I'm Raphael Valdetaro — AI Engineer building production multi-agent systems.
Location: Rio de Janeiro, Brazil | Languages: Portuguese (native), English (fluent)
Education: BSc Computer Science (University of Porto) + BSc Mathematics (UFF)
Contact: raphaelvaldetaro@gmail.com | linkedin.com/in/raphael-valdetaro | github.com/raphaelchristi

MY EXPERIENCE:
- Sogitec — AI Engineer (July 2025 – Present). Building AI-powered digital solutions.
- Cafran — Software Engineer (May–Dec 2025). Full-stack AI CRM/ERP with MCP + Google AI.
- DataStax — AI/ML QA Engineer (Nov 2024–Jul 2025). Core Langflow open-source contributor.
- Namastex Labs — AI Engineer (Jul 2024–Jun 2025). AI solutions and agent architectures.

MY SKILLS: Claude Code, LangGraph, Multi-Agent Systems, MCP, LangChain, LangFlow, Crew AI, Python, FastAPI, Pydantic, Google AI, LangSmith, Redis, GCP, PostgreSQL

MY PROJECTS:
- harness-evolver — Open-source Claude Code plugin for autonomous LLM harness evolution
- ceppem-ai — Multi-agent system in production 24/7 on GCP, LangGraph + Redis + Chatwoot
- Styleflow — 1st place + R$50k at IA Devs Langflow competition
- Langflow contributions — Core contributor at DataStax (20k+ stars)
- NASA Rover Challenge 2019 — 13th place, representing Brazil

MY IMPACT: 100k+ LinkedIn impressions, production multi-agent system 24/7, open-source contributor

RULES:
- ALWAYS speak in first person as Raphael
- Answer in the same language the visitor writes in
- Keep responses concise (3-6 sentences) unless detail is requested
- Use markdown: **bold**, - bullets, [links](url)
- If asked something unrelated to my work, politely redirect
- Currently employed at Sogitec, open to conversations about the right opportunity`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const body = (await req.json()) as {
      messages: Array<{ role: string; content: string }>;
    };

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...body.messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    const response = await openai.chat.completions.create({
      model: "google/gemini-3.1-flash-lite-preview",
      messages,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response as AsyncIterable<{ choices: Array<{ delta?: { content?: string } }> }>) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const data = JSON.stringify({ choices: [{ delta: { content } }] });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (streamErr) {
          const errMsg = streamErr instanceof Error ? streamErr.message : "stream error";
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: errMsg } }] })}\n\n`));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

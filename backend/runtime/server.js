import express from "express";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
} from "@copilotkit/runtime";

const AGENT_URL = process.env.AGENT_URL || "http://localhost:8000/agent";
const PORT = process.env.PORT || 8642;

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const PYTHON_URL = process.env.PYTHON_URL || "http://agent:8000";

// Health
app.get("/health", (req, res) => {
  res.json({ status: "ok", runtime: "copilotkit", agent: AGENT_URL });
});

// Proxy /v1/chat/completions to Python backend
app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch(`${PYTHON_URL}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    res.writeHead(response.status, {
      "Content-Type": response.headers.get("content-type") || "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    await pump();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CopilotKit runtime endpoint
app.post("/copilotkit", async (req, res) => {
  try {
    const { HttpAgent } = await import("@ag-ui/client");

    const agent = new HttpAgent({ url: AGENT_URL });

    const runtime = new CopilotRuntime({
      agents: { raphael_agent: agent },
    });

    // Forward the request through CopilotKit runtime
    const response = await runtime.process(req.body, {
      serviceAdapter: new ExperimentalEmptyAdapter(),
      endpoint: "/copilotkit",
    });

    // Stream the response
    res.writeHead(response.status || 200, {
      "Content-Type": response.headers?.["content-type"] || "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      };
      await pump();
    } else {
      res.end();
    }
  } catch (err) {
    console.error("CopilotKit error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`CopilotKit Runtime listening on port ${PORT}`);
  console.log(`Agent URL: ${AGENT_URL}`);
});

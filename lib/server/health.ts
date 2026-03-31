import type { IncomingMessage, ServerResponse } from "node:http"

/**
 * A simple health check handler for the VHL runtime.
 * Returns a 200 OK with a JSON body if the request path is /health.
 * @returns true if the request was handled, false otherwise.
 */
export const handleHealthCheck = (req: IncomingMessage, res: ServerResponse): boolean => {
  const url = new URL(req.url || "", `http://${req.headers.host || "localhost"}`)
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ status: "healthy", service: "vhl_runtime" }))
    return true
  }
  return false
}

export * from "./server/agent-websocket-server"
export * from "./server/mock-agent-handler"
export * from "./server/relay-agent-handler"
export * from "./hooks/agent-websocket-types"

import { ensureAgentWebSocketServer } from "./server/agent-websocket-server"
import { RelayAgentHandler } from "./server/relay-agent-handler"

// Auto-start the server with the RelayAgentHandler during module initialization
// checking specifically for Node environment to avoid browser errors
if (typeof process !== "undefined" && process.versions && process.versions.node) {
    try {
        ensureAgentWebSocketServer(() => new RelayAgentHandler())
    } catch (err) {
        console.warn("Failed to auto-start Agent WebSocket server:", err)
    }
}

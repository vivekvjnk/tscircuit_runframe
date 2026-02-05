import type { AgentHandler, AgentMessage } from "../hooks/agent-websocket-types"

/**
 * A handler that relays messages between UI clients and the Agent client.
 * This is the central logic for the Runframe WebSocket Server.
 */
export class RelayAgentHandler implements AgentHandler {
    private static uiClients: Set<(msg: AgentMessage) => void> = new Set()
    private static agentClient: ((msg: AgentMessage) => void) | null = null

    private currentSend: ((msg: AgentMessage) => void) | null = null
    private role: "ui" | "agent" | null = null

    onConnect(send: (msg: AgentMessage) => void) {
        this.currentSend = send
        // By default, we don't know the role until IDENTIFY is sent.
        // But we can notify the new connection about the current agent status.
        if (RelayAgentHandler.agentClient) {
            send({ type: "AGENT_CONNECTED" })
        } else {
            send({ type: "AGENT_DISCONNECTED" })
        }
    }

    async onMessage(msg: AgentMessage, send: (msg: AgentMessage) => void) {
        if (msg.type === "IDENTIFY") {
            this.handleIdentify(msg.payload?.role, send)
            return
        }

        if (this.role === "ui") {
            // UI -> Agent
            if (RelayAgentHandler.agentClient) {
                RelayAgentHandler.agentClient(msg)
            } else {
                send({ type: "ERROR", payload: { message: "No agent client connected" } })
            }
        } else if (this.role === "agent") {
            // Agent -> all UIs
            RelayAgentHandler.uiClients.forEach(uiSend => uiSend(msg))
        } else {
            // Unidentified client trying to send something
            send({ type: "ERROR", payload: { message: "Please IDENTIFY yourself first (role: 'ui' or 'agent')" } })
        }
    }

    private handleIdentify(role: string, send: (msg: AgentMessage) => void) {
        if (role === "ui") {
            this.role = "ui"
            RelayAgentHandler.uiClients.add(send)
            console.log("RelayAgentHandler: UI client identified")
        } else if (role === "agent") {
            this.role = "agent"
            RelayAgentHandler.agentClient = send
            console.log("RelayAgentHandler: Agent client identified")
            // Notify all UIs that agent is connected
            RelayAgentHandler.uiClients.forEach(uiSend => uiSend({ type: "AGENT_CONNECTED" }))
        }
    }

    onDisconnect() {
        if (this.role === "ui" && this.currentSend) {
            RelayAgentHandler.uiClients.delete(this.currentSend)
        } else if (this.role === "agent") {
            RelayAgentHandler.agentClient = null
            console.log("RelayAgentHandler: Agent client disconnected")
            // Notify all UIs that agent is gone
            RelayAgentHandler.uiClients.forEach(uiSend => uiSend({ type: "AGENT_DISCONNECTED" }))
        }
    }
}

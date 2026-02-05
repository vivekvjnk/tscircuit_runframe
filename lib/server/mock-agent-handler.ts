import type { AgentHandler, AgentMessage } from "../hooks/agent-websocket-types"

/**
 * A mock agent handler that helps in testing the WebSocket connection.
 * It just echoes back messages or provides placeholder responses.
 */
export class MockAgentHandler implements AgentHandler {
    private send?: (msg: AgentMessage) => void

    onConnect(send: (msg: AgentMessage) => void) {
        this.send = send
        console.log("MockAgentHandler: Agent connected")
    }

    async onMessage(msg: AgentMessage, send: (msg: AgentMessage) => void) {
        console.log("MockAgentHandler: Received message", msg.type)

        switch (msg.type) {
            case "USER_PROMPT":
                send({ type: "AGENT_THINKING", payload: { text: "I am thinking about: " + msg.payload.prompt } })

                // Simulate some work
                setTimeout(() => {
                    send({ type: "EVALUATION_STATUS", payload: { text: "Validating your request..." } })

                    setTimeout(() => {
                        send({
                            type: "FILE_SYNC_COMPLETE",
                            payload: { message: "Successfully processed: " + msg.payload.prompt }
                        })
                    }, 1500)
                }, 1000)
                break

            case "DOCUMENT_UPLOAD":
                send({ type: "AGENT_THINKING", payload: { text: "Parsing document: " + msg.payload.fileName } })
                setTimeout(() => {
                    send({ type: "FILE_SYNC_COMPLETE", payload: { message: "Document processed" } })
                }, 1000)
                break

            case "CANCEL_TASK":
                send({ type: "ERROR", payload: { message: "Task cancelled by user" } })
                break

            default:
                console.warn("MockAgentHandler: Unknown message type", msg.type)
        }
    }

    onDisconnect() {
        console.log("MockAgentHandler: Agent disconnected")
    }
}

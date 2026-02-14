import { useState, useCallback } from "react"
import { AgentStatus } from "../types"
import { WebSocketMessage, AgentMessage } from "lib/hooks/use-agent-socket"

export const useAgentStatus = () => {
    const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle")

    const handleStatusMessage = useCallback((msg: WebSocketMessage) => {
        const agentMsg = msg as AgentMessage

        switch (agentMsg.type) {
            case "STATE_TRANSITION":
                if (agentMsg.payload?.to === "THINKING") {
                    setAgentStatus("thinking")
                } else if (agentMsg.payload?.to === "IDLE") {
                    setAgentStatus("idle")
                }
                break

            case "EVALUATION_UPDATE":
                if (agentMsg.payload?.status === "running") {
                    setAgentStatus("evaluating")
                } else if (agentMsg.payload?.status === "pass") {
                    setAgentStatus("idle")
                }
                break

            case "ARTIFACT_UPDATED":
            case "AUTHORITY_REQUIRED":
            case "HIL_REQUEST":
                setAgentStatus("idle")
                break

            case "ERROR":
                setAgentStatus("failed")
                break
        }
    }, [])

    return {
        agentStatus,
        setAgentStatus,
        handleStatusMessage
    }
}

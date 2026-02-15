export type AgentStatus = "idle" | "thinking" | "evaluating" | "failed" | "completed"

export type ProjectUIState =
    | "NO_PROJECT"
    | "CREATING_PROJECT"
    | "AGENT_READY"
    | "VHL_READY"
    | "PROJECT_INITIALIZED"

export interface Message {
    role: "user" | "assistant"
    content: string
    status?: AgentStatus
    image?: string
}

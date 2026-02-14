export type AgentStatus = "idle" | "thinking" | "evaluating" | "failed"

export interface Message {
    role: "user" | "assistant"
    content: string
    status?: "thinking" | "evaluating" | "completed" | "error"
    image?: string
}

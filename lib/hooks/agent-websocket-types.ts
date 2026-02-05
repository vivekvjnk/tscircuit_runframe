export type MessageType =
    | "USER_PROMPT"
    | "DOCUMENT_UPLOAD"
    | "CANCEL_TASK"
    | "AGENT_THINKING"
    | "EVALUATION_STATUS"
    | "CODE_GENERATED"
    | "FILE_SYNC_COMPLETE"
    | "ERROR"
    | "IDENTIFY"
    | "AGENT_CONNECTED"
    | "AGENT_DISCONNECTED"

export interface AgentMessage {
    type: MessageType
    payload?: any
}

export interface AgentHandler {
    onConnect?: (send: (msg: AgentMessage) => void) => void
    onMessage: (msg: AgentMessage, send: (msg: AgentMessage) => void) => Promise<void>
    onDisconnect?: () => void
}

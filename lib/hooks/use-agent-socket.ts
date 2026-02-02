import { useState, useEffect, useCallback, useRef } from "react"

export type MessageType =
    | "USER_PROMPT"
    | "DOCUMENT_UPLOAD"
    | "CANCEL_TASK"
    | "AGENT_THINKING"
    | "EVALUATION_STATUS"
    | "CODE_GENERATED"
    | "FILE_SYNC_COMPLETE"
    | "ERROR"

export interface AgentMessage {
    type: MessageType
    payload?: any
}

export const useAgentSocket = (url: string, onMessage: (msg: AgentMessage) => void) => {
    const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("closed")
    const socketRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!url) return

        const connect = () => {
            setStatus("connecting")
            const ws = new WebSocket(url)
            socketRef.current = ws

            ws.onopen = () => {
                setStatus("open")
                console.log("WebSocket connected to agent server")
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as AgentMessage
                    onMessage(data)
                } catch (err) {
                    console.error("Failed to parse WebSocket message", err)
                }
            }

            ws.onclose = () => {
                setStatus("closed")
                console.log("WebSocket disconnected from agent server")
                // Optionally reconnect after a delay
            }

            ws.onerror = (err) => {
                setStatus("error")
                console.error("WebSocket error:", err)
            }
        }

        connect()

        return () => {
            socketRef.current?.close()
        }
    }, [url, onMessage])

    const send = useCallback((msg: AgentMessage) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg))
        } else {
            console.warn("WebSocket is not open. Cannot send message:", msg)
        }
    }, [])

    return { status, send }
}

import { useState, useEffect, useCallback, useRef } from "react"
import type { WebSocketMessage } from "./agent-websocket-types"

export type { EventType, AgentMessage, WebSocketMessage } from "./agent-websocket-types"

export const useAgentSocket = (url: string, onMessage: (msg: WebSocketMessage) => void, onOpen?: (send: (msg: WebSocketMessage) => void) => void) => {
    const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("closed")
    const socketRef = useRef<WebSocket | null>(null)

    const send = useCallback((msg: WebSocketMessage) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg))
        } else {
            console.warn("WebSocket is not open. Cannot send message:", msg)
        }
    }, [])

    useEffect(() => {
        if (!url) return

        const connect = () => {
            setStatus("connecting")
            const ws = new WebSocket(url)
            socketRef.current = ws

            ws.onopen = () => {
                setStatus("open")
                console.log("WebSocket connected to agent server")
                if (onOpen) {
                    onOpen(send)
                }
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as WebSocketMessage
                    onMessage(data)
                } catch (err) {
                    console.error("Failed to parse WebSocket message", err)
                }
            }

            ws.onclose = () => {
                setStatus("closed")
                console.log("WebSocket disconnected from agent server")
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
    }, [url, onMessage, onOpen, send])

    return { status, send }
}

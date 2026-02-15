import { useState, useEffect, useCallback, useRef } from "react"
import type { WebSocketMessage } from "./agent-websocket-types"

export type { EventType, AgentMessage, WebSocketMessage } from "./agent-websocket-types"

export const useAgentSocket = (url: string, onMessage: (msg: WebSocketMessage) => void, onOpen?: (send: (msg: WebSocketMessage) => void) => void) => {
    const [status, setStatus] = useState<"connecting" | "open" | "closed" | "error">("closed")
    const socketRef = useRef<WebSocket | null>(null)

    const send = useCallback((msg: WebSocketMessage) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            console.debug("[useAgentSocket] Sending message:", msg)
            socketRef.current.send(JSON.stringify(msg))
        } else {
            console.warn("WebSocket is not open. Cannot send message:", msg)
        }
    }, [])

    useEffect(() => {
        if (!url) return

        const connect = () => {
            console.log(`[useAgentSocket] Attempting to connect to ${url}...`)
            setStatus("connecting")
            const ws = new WebSocket(url)
            socketRef.current = ws

            ws.onopen = () => {
                setStatus("open")
                console.log(`[useAgentSocket] Successfully connected to ${url}`)
                if (onOpen) {
                    onOpen(send)
                }
            }

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as WebSocketMessage
                    console.debug("[useAgentSocket] Received message:", data)
                    onMessage(data)
                } catch (err) {
                    console.error("[useAgentSocket] Failed to parse WebSocket message", err, event.data)
                }
            }

            ws.onclose = (event) => {
                setStatus("closed")
                console.log(`[useAgentSocket] Disconnected from ${url}. Code: ${event.code}, Reason: ${event.reason}`)
            }

            ws.onerror = (err) => {
                setStatus("error")
                console.error(`[useAgentSocket] WebSocket error connecting to ${url}:`, err)
            }
        }

        connect()

        return () => {
            socketRef.current?.close()
        }
    }, [url, onMessage, onOpen, send])

    return { status, send }
}

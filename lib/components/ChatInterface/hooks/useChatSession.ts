import { useState } from "react"
import { Message, AgentStatus } from "../types"

export const useChatSession = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! How can I help you with your circuit design today?" }
    ])

    const addUserMessage = (content: string, image?: string) => {
        setMessages(prev => [...prev, { role: "user", content, image }])
    }

    const addAssistantMessage = (content: string, status?: AgentStatus) => {
        setMessages(prev => [...prev, { role: "assistant", content, status }])
    }

    const updateLastAssistantMessage = (content: string, status?: AgentStatus) => {
        setMessages(prev => {
            const last = prev[prev.length - 1]
            if (last && last.role === "assistant") {
                // If the last message was a status update (thinking/evaluating), we update it.
                // If we are just appending text, we might want to check that too, but here we replace mostly.
                return [...prev.slice(0, -1), { ...last, content, status }]
            }
            // If no assistant message to update, add new one
            return [...prev, { role: "assistant", content, status }]
        })
    }

    const setError = (content: string) => {
        setMessages(prev => [...prev, { role: "assistant", content, status: "error" }])
    }

    return {
        messages,
        addUserMessage,
        addAssistantMessage,
        updateLastAssistantMessage,
        setError
    }
}

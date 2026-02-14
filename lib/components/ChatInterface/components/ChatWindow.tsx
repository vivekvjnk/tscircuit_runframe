import React from "react"
import { ChatHeader } from "./ChatHeader"
import { MessageList } from "./MessageList"
import { AgentStatusBar } from "./AgentStatusBar"
import { Message, AgentStatus } from "../types"

interface ChatWindowProps {
    messages: Message[]
    agentStatus: AgentStatus
    isPinned: boolean
    isAgentConnected: boolean
    wsStatus: "connecting" | "open" | "closed"
    onTogglePin: () => void
    onClose: () => void
    onInterrupt: () => void
}

export const ChatWindow = ({
    messages,
    agentStatus,
    isPinned,
    isAgentConnected,
    wsStatus,
    onTogglePin,
    onClose,
    onInterrupt
}: ChatWindowProps) => {
    return (
        <div className="rf-w-[400px] rf-h-[500px] rf-bg-white rf-rounded-2xl rf-shadow-2xl rf-border rf-border-gray-100 rf-flex rf-flex-col rf-overflow-hidden rf-animate-in rf-fade-in rf-slide-in-from-bottom-4">
            <ChatHeader
                isPinned={isPinned}
                onTogglePin={onTogglePin}
                onClose={onClose}
                isAgentConnected={isAgentConnected}
                wsStatus={wsStatus}
            />
            <MessageList messages={messages} />
            <AgentStatusBar agentStatus={agentStatus} onInterrupt={onInterrupt} />
        </div>
    )
}

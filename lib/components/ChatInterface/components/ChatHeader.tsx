import React from "react"
import { Sparkles, Pin, PinOff, X } from "lucide-react"
import { cn } from "lib/utils"

interface ChatHeaderProps {
    isPinned: boolean
    onTogglePin: () => void
    onClose: () => void
    isAgentConnected: boolean
    wsStatus: "connecting" | "open" | "closed" | "error"
}

export const ChatHeader = ({ isPinned, onTogglePin, onClose, isAgentConnected, wsStatus }: ChatHeaderProps) => {
    return (
        <div className="rf-p-4 rf-border-b rf-bg-gray-50/50 rf-flex rf-items-center rf-justify-between">
            <div className="rf-flex rf-items-center rf-gap-2">
                <div className="rf-bg-blue-600 rf-p-1.5 rf-rounded-lg">
                    <Sparkles className="rf-w-4 rf-h-4 rf-text-white" />
                </div>
                <div>
                    <h3 className="rf-font-semibold rf-text-sm rf-text-gray-800">tscircuit AI Assistant</h3>
                    <div className="rf-flex rf-items-center rf-gap-1.5">
                        <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", wsStatus === "open" ? (isAgentConnected ? "rf-bg-green-500" : "rf-bg-yellow-500") : "rf-bg-red-500")} />
                        <span className="rf-text-[10px] rf-text-gray-500 rf-uppercase rf-tracking-wider">
                            {wsStatus === "open" ? (isAgentConnected ? "Agent Ready" : "Waiting for Agent") : "Disconnected"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="rf-flex rf-items-center rf-gap-2">
                <button
                    onClick={onTogglePin}
                    className={cn(
                        "rf-p-1 rf-rounded-lg rf-transition-colors",
                        isPinned ? "rf-bg-blue-100 rf-text-blue-600" : "rf-text-gray-400 hover:rf-bg-gray-200"
                    )}
                    title={isPinned ? "Unpin chat" : "Pin chat"}
                >
                    {isPinned ? <Pin className="rf-w-4 rf-h-4" /> : <PinOff className="rf-w-4 rf-h-4" />}
                </button>
                <button
                    onClick={onClose}
                    className="rf-p-1 rf-rounded-lg hover:rf-bg-gray-200 rf-transition-colors"
                >
                    <X className="rf-w-4 rf-h-4 rf-text-gray-500" />
                </button>
            </div>
        </div>
    )
}

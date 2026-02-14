import React from "react"
import { Loader2, Terminal } from "lucide-react"
import { cn } from "lib/utils"
import { Message } from "../types"

interface MessageBubbleProps {
    message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
    return (
        <div
            className={cn(
                "rf-flex rf-flex-col rf-gap-1.5 rf-max-w-[85%]",
                message.role === "user" ? "rf-self-end rf-items-end" : "rf-self-start rf-items-start"
            )}
        >
            <div className={cn(
                "rf-p-3 rf-rounded-2xl rf-text-sm rf-shadow-sm rf-border",
                message.role === "user"
                    ? "rf-bg-blue-600 rf-text-white rf-border-blue-700 rf-rounded-tr-none"
                    : "rf-bg-white rf-text-gray-700 rf-border-gray-100 rf-rounded-tl-none"
            )}>
                {message.image && (
                    <div className="rf-mb-2 rf-rounded-lg rf-overflow-hidden rf-border rf-border-white/20">
                        <img src={message.image} alt="Uploaded" className="rf-w-full rf-h-auto" />
                    </div>
                )}
                {message.content}

                {message.status && message.status !== "completed" && (
                    <div className="rf-mt-2 rf-flex rf-items-center rf-gap-2 rf-text-[11px] rf-font-medium rf-opacity-80">
                        {message.status === "thinking" && <Loader2 className="rf-w-3 rf-h-3 rf-animate-spin" />}
                        {message.status === "evaluating" && <Terminal className="rf-w-3 rf-h-3" />}
                        <span className="rf-capitalize">{message.status}...</span>
                    </div>
                )}
            </div>
        </div>
    )
}

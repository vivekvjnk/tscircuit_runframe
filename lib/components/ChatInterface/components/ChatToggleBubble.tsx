import React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "lib/utils"

interface ChatToggleBubbleProps {
    isMinimized: boolean
    onClick: () => void
}

export const ChatToggleBubble = ({ isMinimized, onClick }: ChatToggleBubbleProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "rf-flex rf-items-center rf-justify-center rf-transition-all rf-duration-500 rf-flex-shrink-0",
                isMinimized
                    ? "rf-w-full rf-h-full"
                    : "rf-w-9 rf-h-9 rf-bg-blue-600 rf-rounded-full rf-ml-0.5"
            )}
        >
            <Sparkles className={cn(
                "rf-text-white rf-transition-all rf-duration-500",
                isMinimized ? "rf-w-6 rf-h-6" : "rf-w-4 rf-h-4"
            )} />
        </button>
    )
}

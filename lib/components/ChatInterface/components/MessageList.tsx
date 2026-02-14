import React, { useEffect, useRef } from "react"
import { Message } from "../types"
import { MessageBubble } from "./MessageBubble"

interface MessageListProps {
    messages: Message[]
}

export const MessageList = ({ messages }: MessageListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div
            ref={scrollRef}
            className="rf-flex-grow rf-p-4 rf-overflow-y-auto rf-bg-gray-50/30 rf-flex rf-flex-col rf-gap-4"
        >
            {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
            ))}
        </div>
    )
}

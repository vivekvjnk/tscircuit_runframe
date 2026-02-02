import React, { useState } from "react"
import { Search, Send, X, MessageSquare, Sparkles } from "lucide-react"
import { cn } from "lib/utils"

export const ChatInterface = () => {
    const [query, setQuery] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        console.log("Submitting query:", query)
        // Handle query submission logic here
        setQuery("")
    }

    return (
        <div className="rf-absolute rf-bottom-6 rf-right-6 rf-z-[100] rf-flex rf-flex-col rf-items-end rf-gap-4">
            {/* Chat Window (Hidden for now, can be expanded) */}
            {isOpen && (
                <div className="rf-w-[400px] rf-h-[500px] rf-bg-white rf-rounded-2xl rf-shadow-2xl rf-border rf-border-gray-100 rf-flex rf-flex-col rf-overflow-hidden rf-animate-in rf-fade-in rf-slide-in-from-bottom-4">
                    <div className="rf-p-4 rf-border-b rf-bg-gray-50/50 rf-flex rf-items-center rf-justify-between">
                        <div className="rf-flex rf-items-center rf-gap-2">
                            <div className="rf-bg-blue-600 rf-p-1.5 rf-rounded-lg">
                                <Sparkles className="rf-w-4 rf-h-4 rf-text-white" />
                            </div>
                            <span className="rf-font-semibold rf-text-sm rf-text-gray-800">tscircuit AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rf-p-1 rf-rounded-lg hover:rf-bg-gray-200 rf-transition-colors"
                        >
                            <X className="rf-w-4 rf-h-4 rf-text-gray-500" />
                        </button>
                    </div>
                    <div className="rf-flex-grow rf-p-4 rf-overflow-y-auto rf-bg-gray-50/30">
                        <div className="rf-flex rf-flex-col rf-gap-4">
                            <div className="rf-bg-white rf-p-3 rf-rounded-2xl rf-rounded-tl-none rf-shadow-sm rf-border rf-border-gray-100 rf-max-w-[85%] rf-text-sm rf-text-gray-700">
                                Hello! How can I help you with your circuit design today?
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Google Search Style Bar */}
            <form
                onSubmit={handleSubmit}
                className={cn(
                    "rf-flex rf-items-center rf-bg-white rf-rounded-full rf-shadow-2xl rf-border rf-border-gray-100 rf-px-4 rf-py-2 rf-transition-all rf-duration-300 hover:rf-shadow-xl focus-within:rf-ring-2 focus-within:rf-ring-blue-500/20",
                    isOpen ? "rf-w-[400px]" : "rf-w-[320px] focus-within:rf-w-[400px]"
                )}
            >
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="rf-cursor-pointer rf-mr-3 rf-group"
                >
                    <Search className="rf-w-5 rf-h-5 rf-text-gray-400 group-hover:rf-text-blue-500 rf-transition-colors" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        // Optional: expand or show tips
                    }}
                    placeholder="Ask tscircuit AI..."
                    className="rf-flex-grow rf-bg-transparent rf-outline-none rf-text-sm rf-text-gray-700 placeholder:rf-text-gray-400"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="rf-p-1 rf-rounded-full hover:rf-bg-gray-100 rf-transition-colors rf-mr-2"
                    >
                        <X className="rf-w-4 rf-h-4 rf-text-gray-400" />
                    </button>
                )}
                <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-2" />
                <button
                    type="submit"
                    className={cn(
                        "rf-p-2 rf-rounded-full rf-transition-all",
                        query.trim() ? "rf-bg-blue-600 rf-text-white rf-shadow-md" : "rf-bg-gray-50 rf-text-gray-300"
                    )}
                    disabled={!query.trim()}
                >
                    <Send className="rf-w-3.5 rf-h-3.5" />
                </button>
            </form>
        </div>
    )
}

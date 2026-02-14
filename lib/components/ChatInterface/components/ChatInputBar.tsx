import React, { useRef } from "react"
import { Send, X, Image as ImageIcon, ChevronUp, ChevronDown, Minimize2 } from "lucide-react"
import { cn } from "lib/utils"

interface ChatInputBarProps {
    query: string
    setQuery: (query: string) => void
    onSubmit: (e: React.FormEvent) => void
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    onMinimize: () => void
    onToggleHistory: () => void
    isHistoryOpen: boolean
    inputRef?: React.RefObject<HTMLInputElement>
    disabled?: boolean
}

export const ChatInputBar = ({
    query,
    setQuery,
    onSubmit,
    onFileUpload,
    onMinimize,
    onToggleHistory,
    isHistoryOpen,
    inputRef,
    disabled
}: ChatInputBarProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="rf-flex rf-items-center rf-flex-grow rf-animate-in rf-fade-in rf-duration-700 rf-delay-150">
            <form
                onSubmit={onSubmit}
                className="rf-flex rf-items-center rf-flex-grow rf-ml-2"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileUpload}
                    className="rf-hidden"
                    accept="image/*,.pdf"
                />

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask tscircuit AI..."
                    className="rf-flex-grow rf-bg-transparent rf-outline-none rf-text-sm rf-text-gray-700 placeholder:rf-text-gray-400 rf-py-2"
                    disabled={disabled}
                />

                <div className="rf-flex rf-items-center rf-gap-1 rf-ml-2">
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="rf-p-1 rf-rounded-full hover:rf-bg-gray-100 rf-transition-colors"
                        >
                            <X className="rf-w-3.5 rf-h-3.5 rf-text-gray-400" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rf-p-1.5 rf-rounded-full hover:rf-bg-gray-100 rf-transition-colors rf-text-gray-400 hover:rf-text-blue-500"
                        title="Upload documentation"
                        disabled={disabled}
                    >
                        <ImageIcon className="rf-w-4 rf-h-4" />
                    </button>

                    <button
                        type="button"
                        onClick={onToggleHistory}
                        className={cn(
                            "rf-p-1.5 rf-rounded-full rf-transition-colors",
                            isHistoryOpen ? "rf-text-blue-600 rf-bg-blue-50" : "rf-text-gray-400 hover:rf-bg-gray-100"
                        )}
                        title="Toggle chat history"
                    >
                        {isHistoryOpen ? <ChevronDown className="rf-w-4 rf-h-4" /> : <ChevronUp className="rf-w-4 rf-h-4" />}
                    </button>
                </div>

                <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-2" />

                <button
                    type="submit"
                    className={cn(
                        "rf-p-2 rf-rounded-full rf-transition-all",
                        query.trim() && !disabled ? "rf-bg-blue-600 rf-text-white rf-shadow-md" : "rf-bg-gray-50 rf-text-gray-300"
                    )}
                    disabled={!query.trim() || disabled}
                >
                    <Send className="rf-w-3.5 rf-h-3.5" />
                </button>

                <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-2" />

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onMinimize()
                    }}
                    className="rf-p-2 rf-rounded-full hover:rf-bg-gray-100 rf-text-gray-400 hover:rf-text-red-500 rf-transition-colors"
                    title="Minimize to bubble"
                >
                    <Minimize2 className="rf-w-3.5 rf-h-3.5" />
                </button>
            </form>
        </div>
    )
}

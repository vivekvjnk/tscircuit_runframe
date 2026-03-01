import React, { useRef, useEffect } from "react"
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
    inputRef?: React.RefObject<HTMLInputElement | null> | any
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
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = () => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.style.height = 'auto'
        const newHeight = Math.min(textarea.scrollHeight, window.innerHeight * 0.25)
        textarea.style.height = `${newHeight}px`
    }

    useEffect(() => {
        adjustHeight()
    }, [query])

    const handleRef = (node: HTMLTextAreaElement | null) => {
        (textareaRef as any).current = node
        if (inputRef && typeof inputRef === 'object') {
            (inputRef as any).current = node
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const form = e.currentTarget.closest('form')
            if (form) {
                const submitEvent = new Event('submit', { cancelable: true, bubbles: true })
                form.dispatchEvent(submitEvent)
            }
        }
    }

    return (
        <div className="rf-flex rf-items-end rf-flex-grow rf-animate-in rf-fade-in rf-duration-700 rf-delay-150 rf-py-2">
            <form
                onSubmit={onSubmit}
                className="rf-flex rf-items-end rf-flex-grow rf-gap-1.5"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileUpload}
                    className="rf-hidden"
                    accept="image/*,.pdf"
                />

                <textarea
                    ref={handleRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask tscircuit AI..."
                    className="rf-flex-grow rf-bg-transparent rf-outline-none rf-text-sm rf-text-gray-700 placeholder:rf-text-gray-400 rf-py-2 rf-resize-none rf-max-h-[25vh] rf-overflow-y-auto rf-custom-scrollbar"
                    disabled={disabled}
                    rows={1}
                />

                <div className="rf-flex rf-items-center rf-gap-1 rf-mb-1">
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

                <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-1 rf-mb-2" />

                <button
                    type="submit"
                    className={cn(
                        "rf-p-2 rf-rounded-full rf-transition-all rf-mb-1",
                        query.trim() && !disabled ? "rf-bg-blue-600 rf-text-white rf-shadow-md" : "rf-bg-gray-50 rf-text-gray-300"
                    )}
                    disabled={!query.trim() || disabled}
                >
                    <Send className="rf-w-3.5 rf-h-3.5" />
                </button>

                <div className="rf-w-[1px] rf-h-5 rf-bg-gray-200 rf-mx-1 rf-mb-2" />

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onMinimize()
                    }}
                    className="rf-p-2 rf-rounded-full hover:rf-bg-gray-100 rf-text-gray-400 hover:rf-text-red-500 rf-transition-colors rf-mb-1"
                    title="Minimize to bubble"
                >
                    <Minimize2 className="rf-w-3.5 rf-h-3.5" />
                </button>
            </form>
        </div>
    )
}

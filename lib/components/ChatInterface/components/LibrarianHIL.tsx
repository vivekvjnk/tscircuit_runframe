import React, { useState } from "react"
import { Check, RefreshCw, MessageSquare } from "lucide-react"

interface LibrarianHILProps {
    scudContent: string
    onAction: (action: string, data?: any) => void
}

export const LibrarianHIL = ({ scudContent, onAction }: LibrarianHILProps) => {
    const [instructions, setInstructions] = useState("")
    const [isRetrying, setIsRetrying] = useState(false)
    const [isContinued, setIsContinued] = useState(false)

    const handleContinue = () => {
        setIsContinued(true)
        onAction("continue", { instructions: instructions.trim() })
    }

    const handleRetry = () => {
        if (!instructions.trim()) return
        setIsRetrying(true)
        onAction("retry", { instructions })
    }

    if (isContinued) {
        return (
            <div className="rf-mt-3 rf-p-2 rf-bg-green-50 rf-border rf-border-green-100 rf-rounded-lg rf-text-[11px] rf-text-green-700 rf-flex rf-items-center rf-gap-2">
                <Check className="rf-w-3 rf-h-3" />
                <span>Continued to next stage.</span>
            </div>
        )
    }

    return (
        <div className="rf-mt-4 rf-flex rf-flex-col rf-gap-3 rf-border-t rf-pt-3">
            <div className="rf-text-[11px] rf-font-semibold rf-text-gray-500 rf-uppercase rf-tracking-wider">
                Librarian Review Required
            </div>

            <div className="rf-max-h-40 rf-overflow-y-auto rf-bg-gray-50 rf-p-2 rf-rounded-lg rf-border rf-border-gray-200 rf-text-[11px] rf-font-mono rf-whitespace-pre-wrap">
                {scudContent || "No SCUD content available."}
            </div>

            <div className="rf-flex rf-flex-col rf-gap-2">
                <div className="rf-relative">
                    <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="Add instructions or guidelines here..."
                        className="rf-w-full rf-p-2 rf-pr-10 rf-bg-white rf-border rf-border-gray-200 rf-rounded-lg rf-text-xs focus:rf-ring-2 focus:rf-ring-blue-500/20 focus:rf-border-blue-500 rf-outline-none rf-resize-none"
                        rows={2}
                        disabled={isRetrying}
                    />
                    <MessageSquare className="rf-absolute rf-right-3 rf-top-2 rf-w-4 rf-h-4 rf-text-gray-300" />
                </div>

                <div className="rf-flex rf-gap-2">
                    <button
                        onClick={handleRetry}
                        disabled={!instructions.trim() || isRetrying}
                        className="rf-flex-1 rf-flex rf-items-center rf-justify-center rf-gap-2 rf-py-2 rf-bg-blue-50 rf-text-blue-600 rf-rounded-lg rf-text-xs rf-font-medium hover:rf-bg-blue-100 disabled:rf-opacity-50 disabled:rf-cursor-not-allowed rf-transition-colors"
                    >
                        <RefreshCw className={cn("rf-w-3 rf-h-3", isRetrying && "rf-animate-spin")} />
                        {isRetrying ? "Retrying..." : "Retry"}
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={isRetrying}
                        className="rf-flex-1 rf-flex rf-items-center rf-justify-center rf-gap-2 rf-py-2 rf-bg-blue-600 rf-text-white rf-rounded-lg rf-text-xs rf-font-medium hover:rf-bg-blue-700 disabled:rf-opacity-50 rf-transition-colors"
                    >
                        <Check className="rf-w-3 rf-h-3" />
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper for conditional classes if not available globally in this file
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

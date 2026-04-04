import React, { useState } from "react"
import { createPortal } from "react-dom"
import { Check, RefreshCw, MessageSquare, Maximize2, X } from "lucide-react"
import { marked } from "marked"

interface ScudReviewHILProps {
    reason: string
    scudContent: string
    onAction: (action: string, data?: any) => void
}

export const ScudReviewHIL = ({ reason, scudContent, onAction }: ScudReviewHILProps) => {
    const [instructions, setInstructions] = useState("")
    const [isRetrying, setIsRetrying] = useState(false)
    const [isContinued, setIsContinued] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleContinue = () => {
        setIsContinued(true)
        onAction("continue", { instructions: instructions.trim() })
    }

    const handleRetry = () => {
        if (!instructions.trim()) return
        setIsRetrying(true)
        onAction("retry", { instructions })
    }

    const title = reason === "ARCHY_REVIEW" ? "Archy SCUD Review Required" : "Librarian Review Required";

    if (isContinued) {
        return (
            <div className="rf-mt-3 rf-p-2 rf-bg-green-50 rf-border rf-border-green-100 rf-rounded-lg rf-text-[11px] rf-text-green-700 rf-flex rf-items-center rf-gap-2">
                <Check className="rf-w-3 rf-h-3" />
                <span>Continued to next stage.</span>
            </div>
        )
    }

    return (
        <>
            <div className="rf-mt-4 rf-flex rf-flex-col rf-gap-3 rf-border-t rf-pt-3">
                <div className="rf-flex rf-items-center rf-justify-between">
                    <div className="rf-text-[11px] rf-font-semibold rf-text-gray-500 rf-uppercase rf-tracking-wider">
                        {title}
                    </div>
                </div>

                <div className="rf-relative">
                <div className="rf-max-h-40 rf-overflow-hidden rf-bg-gray-50 rf-p-3 rf-rounded-lg rf-border rf-border-gray-200">
                    <div
                        className="rf-markdown rf-text-[11px]"
                        dangerouslySetInnerHTML={{ __html: marked.parse(scudContent || "No SCUD content available.") as string }}
                    />
                        {/* Fade out effect at the bottom of the truncated text */}
                        <div className="rf-absolute rf-bottom-0 rf-left-0 rf-right-0 rf-h-12 rf-bg-gradient-to-t rf-from-gray-50 rf-to-transparent pointer-events-none rounded-b-lg"></div>
                    </div>
                    
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="rf-absolute rf-bottom-2 rf-right-2 rf-bg-white rf-shadow-sm rf-border rf-border-gray-200 rf-text-gray-600 rf-p-1.5 rf-rounded-md hover:rf-bg-gray-50 rf-transition-colors rf-flex rf-items-center rf-gap-1 z-10"
                        title="Expand full document"
                    >
                        <Maximize2 className="rf-w-3 rf-h-3" />
                        <span className="rf-text-[10px] rf-font-medium">Expand</span>
                    </button>
                </div>

                <div className="rf-flex rf-flex-col rf-gap-2">
                    <div className="rf-relative">
                        <textarea
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Add instructions or guidelines to rebuild..."
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
                            {isRetrying ? "Retrying..." : "Retry (Rebuild)"}
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

            {/* Expanded Modal Overlay */}
            {isExpanded && typeof document !== 'undefined' && createPortal(
                <div className="rf-fixed rf-inset-0 rf-z-[9999] rf-bg-black/40 rf-backdrop-blur-sm rf-flex rf-items-center rf-justify-center rf-p-8">
                    <div className="rf-bg-white rf-rounded-xl rf-shadow-2xl rf-w-full rf-h-full rf-max-w-4xl rf-max-h-[85vh] rf-flex rf-flex-col rf-overflow-hidden">
                        <div className="rf-flex rf-items-center rf-justify-between rf-p-4 rf-border-b rf-border-gray-100 rf-bg-gray-50">
                            <h3 className="rf-text-sm rf-font-semibold rf-text-gray-700">{title}</h3>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="rf-p-1.5 rf-text-gray-400 hover:rf-text-gray-600 hover:rf-bg-gray-200 rf-rounded-md rf-transition-colors"
                            >
                                <X className="rf-w-5 rf-h-5" />
                            </button>
                        </div>
                        <div className="rf-flex-1 rf-p-8 rf-overflow-y-auto rf-bg-white">
                            <div
                                className="rf-markdown rf-text-sm"
                                dangerouslySetInnerHTML={{ __html: marked.parse(scudContent || "No SCUD content available.") as string }}
                            />
                        </div>
                        <div className="rf-p-4 rf-border-t rf-border-gray-100 rf-bg-white rf-flex rf-justify-end">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="rf-px-4 rf-py-2 rf-bg-blue-600 rf-text-white rf-rounded-lg rf-text-sm rf-font-medium hover:rf-bg-blue-700 rf-transition-colors"
                            >
                                Close & Return to Chat
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

// Helper for conditional classes if not available globally in this file
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

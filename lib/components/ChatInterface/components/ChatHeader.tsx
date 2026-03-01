import React from "react"
import { Sparkles, Pin, PinOff, X, Database, Activity, Play, CheckCircle, FolderX } from "lucide-react"
import { cn } from "lib/utils"

interface ChatHeaderProps {
    isPinned: boolean
    onTogglePin: () => void
    onClose: () => void
    isAgentConnected: boolean
    wsStatus: "connecting" | "open" | "closed" | "error"
    projectName?: string | null
    projectStatus?: { backend_status: string; runtime_status: string }
    agentStatus?: { archy: string; librarian: string; ana: string; aosm: string }
    isSynthesizable?: boolean
    onSynthesize?: () => void
    synthesisCompleted?: boolean
    onCloseProject?: () => void
}

export const ChatHeader = ({
    isPinned, onTogglePin, onClose, isAgentConnected, wsStatus,
    projectName, projectStatus, agentStatus, isSynthesizable, onSynthesize, synthesisCompleted,
    onCloseProject
}: ChatHeaderProps) => {

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "initialized":
            case "idle":
                return "rf-bg-emerald-500"
            case "initializing":
            case "running":
                return "rf-bg-blue-500 rf-animate-pulse"
            default:
                return "rf-bg-gray-400"
        }
    }

    return (
        <div className="rf-flex rf-flex-col rf-border-b rf-bg-gray-50/50">
            {/* Top Bar */}
            <div className="rf-p-3 rf-flex rf-items-center rf-justify-between">
                <div className="rf-flex rf-items-center rf-gap-2">
                    <div className="rf-bg-blue-600 rf-p-1.5 rf-rounded-lg">
                        <Sparkles className="rf-w-4 rf-h-4 rf-text-white" />
                    </div>
                    <div className="rf-flex rf-flex-col">
                        <h3 className="rf-font-semibold rf-text-sm rf-text-gray-800">
                            {projectName ? `Project: ${projectName}` : "tscircuit AI Assistant"}
                        </h3>
                        <div className="rf-flex rf-items-center rf-gap-1.5">
                            <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", wsStatus === "open" ? (isAgentConnected ? "rf-bg-green-500" : "rf-bg-yellow-500") : "rf-bg-red-500")} />
                            <span className="rf-text-[10px] rf-text-gray-500 rf-uppercase rf-tracking-wider">
                                {wsStatus === "open" ? (isAgentConnected ? "Agent Ready" : "Waiting for Agent") : "Disconnected"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="rf-flex rf-items-center rf-gap-2">
                    {/* Synthesis Status / Button */}
                    {projectName && !synthesisCompleted && isSynthesizable && onSynthesize && (
                        <button
                            onClick={onSynthesize}
                            className="rf-flex rf-items-center rf-gap-1 rf-px-2 rf-py-1 rf-bg-blue-600 hover:rf-bg-blue-700 rf-text-white rf-text-xs rf-rounded-md rf-shadow-sm rf-transition-colors"
                        >
                            <Play className="rf-w-3 rf-h-3" />
                            Synthesize
                        </button>
                    )}
                    {projectName && synthesisCompleted && (
                        <div className="rf-flex rf-items-center rf-gap-1 rf-px-2 rf-py-1 rf-bg-emerald-50 rf-border rf-border-emerald-200 rf-text-emerald-700 rf-text-xs rf-rounded-md">
                            <CheckCircle className="rf-w-3 rf-h-3" />
                            Synthesized
                        </div>
                    )}

                    {projectName && onCloseProject && (
                        <button
                            onClick={onCloseProject}
                            className="rf-p-1 rf-rounded-lg rf-text-gray-400 hover:rf-bg-red-50 hover:rf-text-red-500 rf-transition-colors"
                            title="Close Project"
                        >
                            <FolderX className="rf-w-4 rf-h-4" />
                        </button>
                    )}

                    <div className="rf-w-px rf-h-4 rf-bg-gray-300 rf-mx-1" />

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

            {/* Status Bar (Condensend System Dashboard) */}
            {projectName && projectStatus && agentStatus && (
                <div className="rf-px-3 rf-pb-2 rf-pt-1.5 rf-flex rf-items-center rf-gap-4 rf-text-[9px] rf-text-gray-500 rf-bg-white rf-border-t rf-border-gray-100/50">
                    <div className="rf-flex rf-items-center rf-gap-3">
                        <div className="rf-flex rf-items-center rf-gap-1">
                            <Database className="rf-w-2.5 rf-h-2.5 rf-text-gray-400" />
                            <span className="rf-font-bold rf-uppercase rf-tracking-tighter rf-text-gray-400 rf-mr-1">Sys:</span>
                        </div>
                        <div className="rf-flex rf-items-center rf-gap-2">
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(projectStatus.backend_status))} />
                                <span className="rf-font-medium">Backend</span>
                            </div>
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(projectStatus.runtime_status))} />
                                <span className="rf-font-medium">Runtime</span>
                            </div>
                        </div>
                    </div>

                    <div className="rf-w-px rf-h-3 rf-bg-gray-200" />

                    <div className="rf-flex rf-items-center rf-gap-3">
                        <div className="rf-flex rf-items-center rf-gap-1">
                            <Activity className="rf-w-2.5 rf-h-2.5 rf-text-gray-400" />
                            <span className="rf-font-bold rf-uppercase rf-tracking-tighter rf-text-gray-400 rf-mr-1">Agents:</span>
                        </div>
                        <div className="rf-flex rf-items-center rf-gap-2">
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(agentStatus.aosm))} />
                                <span className="rf-font-medium">AOSM</span>
                            </div>
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(agentStatus.ana))} />
                                <span className="rf-font-medium">ANA</span>
                            </div>
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(agentStatus.archy))} />
                                <span className="rf-font-medium">Archy</span>
                            </div>
                            <div className="rf-flex rf-items-center rf-gap-1">
                                <div className={cn("rf-w-1.5 rf-h-1.5 rf-rounded-full", getStatusColor(agentStatus.librarian))} />
                                <span className="rf-font-medium">Lib</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

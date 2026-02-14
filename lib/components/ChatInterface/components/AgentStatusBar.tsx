import React from "react"
import { Loader2 } from "lucide-react"
import { AgentStatus } from "../types"

interface AgentStatusBarProps {
    agentStatus: AgentStatus
    onInterrupt: () => void
}

export const AgentStatusBar = ({ agentStatus, onInterrupt }: AgentStatusBarProps) => {
    if (agentStatus === "idle") return null

    return (
        <div className="rf-px-4 rf-py-2 rf-bg-blue-50/50 rf-border-t rf-border-blue-100 rf-flex rf-items-center rf-justify-between">
            <div className="rf-flex rf-items-center rf-gap-2">
                <Loader2 className="rf-w-3.5 rf-h-3.5 rf-animate-spin rf-text-blue-600" />
                <span className="rf-text-xs rf-font-medium rf-text-blue-700">
                    {agentStatus === "thinking" ? "Agent is processing..." : "Validating changes..."}
                </span>
            </div>
            <button
                onClick={onInterrupt}
                className="rf-text-xs rf-text-blue-600 hover:rf-text-blue-800 rf-font-semibold"
            >
                Stop
            </button>
        </div>
    )
}

import React from "react"
import { Activity, Database, Zap, Cpu, Users, Search } from "lucide-react"
import { cn } from "lib/utils"

interface SystemStatusDashboardProps {
    projectStatus: {
        backend_status: string
        runtime_status: string
    }
    agentStatus: {
        archy: string
        librarian: string
        ana: string
        aosm: string
    }
}

export const SystemStatusDashboard = ({ projectStatus, agentStatus }: SystemStatusDashboardProps) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "initialized":
            case "idle":
                return "rf-text-emerald-500"
            case "initializing":
            case "running":
                return "rf-text-blue-500 rf-animate-pulse"
            default:
                return "rf-text-gray-400"
        }
    }

    const StatusItem = ({ label, status, icon: Icon }: { label: string, status: string, icon: any }) => (
        <div className="rf-flex rf-items-center rf-justify-between rf-px-3 rf-py-1.5 rf-rounded-lg rf-bg-gray-50 rf-border rf-border-gray-100/50">
            <div className="rf-flex rf-items-center rf-gap-2">
                <Icon className="rf-w-3.5 rf-h-3.5 rf-text-gray-400" />
                <span className="rf-text-[11px] rf-font-medium rf-text-gray-600">{label}</span>
            </div>
            <span className={cn("rf-text-[10px] rf-font-bold rf-uppercase rf-tracking-wider", getStatusColor(status))}>
                {status}
            </span>
        </div>
    )

    return (
        <div className="rf-flex rf-flex-col rf-gap-3 rf-p-4 rf-bg-white rf-rounded-xl rf-border rf-border-gray-100 rf-shadow-sm">
            <div className="rf-flex rf-flex-col rf-gap-2">
                <div className="rf-flex rf-items-center rf-gap-2 rf-mb-1">
                    <Database className="rf-w-3.5 rf-h-3.5 rf-text-blue-600" />
                    <h4 className="rf-text-[11px] rf-font-bold rf-uppercase rf-tracking-widest rf-text-gray-400">Project Engine</h4>
                </div>
                <div className="rf-grid rf-grid-cols-2 rf-gap-2">
                    <StatusItem label="Backend" status={projectStatus.backend_status} icon={Cpu} />
                    <StatusItem label="Runtime" status={projectStatus.runtime_status} icon={Zap} />
                </div>
            </div>

            <div className="rf-flex rf-flex-col rf-gap-2">
                <div className="rf-flex rf-items-center rf-gap-2 rf-mb-1">
                    <Users className="rf-w-3.5 rf-h-3.5 rf-text-purple-600" />
                    <h4 className="rf-text-[11px] rf-font-bold rf-uppercase rf-tracking-widest rf-text-gray-400">Active Agents</h4>
                </div>
                <div className="rf-grid rf-grid-cols-2 rf-gap-2">
                    <StatusItem label="AOSM" status={agentStatus.aosm} icon={Activity} />
                    <StatusItem label="ANA" status={agentStatus.ana} icon={Zap} />
                    <StatusItem label="Archy" status={agentStatus.archy} icon={Search} />
                    <StatusItem label="Librarian" status={agentStatus.librarian} icon={Database} />
                </div>
            </div>
        </div>
    )
}

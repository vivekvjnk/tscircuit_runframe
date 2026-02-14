import { useState } from "react"

export const useAgentPresence = () => {
    const [isAgentConnected, setIsAgentConnected] = useState(false)

    const setConnected = (connected: boolean) => setIsAgentConnected(connected)

    return {
        isAgentConnected,
        setConnected
    }
}

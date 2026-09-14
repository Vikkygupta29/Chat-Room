import { useEffect, useState } from 'react'
import {
    connectToRoom,
    disconnectFromRoom,
    sendMessage,
} from '../services/websocketService'

export default function useWebSocket(
    roomId,
    userName,
    onMessage,
) {
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (!roomId) return

        connectToRoom(
            roomId,
            (message) => {
                onMessage?.(message)
            },
            () => {
                setConnected(true)

                const joinKey = `resilience-chat-joined-${roomId}`

                const alreadyJoined = localStorage.getItem(joinKey)

                if (!alreadyJoined && userName?.trim()) {
                    sendMessage(roomId, {
                        sender: userName.trim(),
                        content: '',
                        type: 'JOIN',
                    })

                    localStorage.setItem(joinKey, 'true')
                }
            },
            () => {
                setConnected(false)
            },
        )

        return () => {
            disconnectFromRoom()
            setConnected(false)
        }
    }, [roomId, userName, onMessage])

    return {
        connected,
    }
}
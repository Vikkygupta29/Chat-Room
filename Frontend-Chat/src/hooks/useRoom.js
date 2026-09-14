import { useCallback, useEffect, useState } from 'react'
import { getRoom, getRoomMessages } from '../services/roomService'
import useWebSocket from './useWebSocket'

export default function useRoom(roomId, userName) {
    const [room, setRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [typingUser, setTypingUser] = useState(null)

    const handleIncomingMessage = useCallback((message) => {
        if (message.type === 'DELETE') {
            setMessages((currentMessages) =>
                currentMessages.filter(
                    (currentMessage) =>
                        currentMessage.id !== message.id,
                ),
            )

            return
        }

        if (message.type === 'TYPING') {
            if (message.sender !== userName) {
                setTypingUser(
                    message.content === 'typing'
                        ? message.sender
                        : null,
                )

                if (message.content === 'typing') {
                    clearTimeout(window.remoteTypingTimer)

                    window.remoteTypingTimer = setTimeout(() => {
                        setTypingUser(null)
                    }, 1500)
                }
            }

            return
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            message,
        ])
    }, [userName])

    const removeMessage = useCallback((messageId) => {
        setMessages((currentMessages) =>
            currentMessages.filter(
                (message) => message.id !== messageId,
            ),
        )
    }, [])

    const { connected } = useWebSocket(
        roomId,
        userName,
        handleIncomingMessage,
    )

    const loadRoom = useCallback(async () => {
        if (!roomId) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            const [roomData, messageData] = await Promise.all([
                getRoom(roomId),
                getRoomMessages(roomId),
            ])

            setRoom(roomData)

            setMessages(
                [...(messageData ?? [])].sort(
                    (a, b) =>
                        new Date(a.timeStamp).getTime() -
                        new Date(b.timeStamp).getTime(),
                ),
            )
        } catch (err) {
            console.error('Failed to load room:', err)

            setError(
                err.response?.data ||
                'Unable to load this room.',
            )
        } finally {
            setLoading(false)
        }
    }, [roomId])

    useEffect(() => {
        let cancelled = false

        async function fetchRoom() {
            if (!roomId) {
                return
            }

            try {
                setLoading(true)
                setError(null)

                const [roomData, messageData] = await Promise.all([
                    getRoom(roomId),
                    getRoomMessages(roomId),
                ])

                if (cancelled) {
                    return
                }

                setRoom(roomData)

                setMessages(
                    [...(messageData ?? [])].sort(
                        (a, b) =>
                            new Date(a.timeStamp).getTime() -
                            new Date(b.timeStamp).getTime(),
                    ),
                )
            } catch (err) {
                if (cancelled) {
                    return
                }

                console.error('Failed to load room:', err)

                setError(
                    err.response?.data ||
                    'Unable to load this room.',
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        fetchRoom()

        return () => {
            cancelled = true
        }
    }, [roomId])

    return {
        room,
        messages,
        loading,
        error,
        connected,
        reload: loadRoom,
        removeMessage,
        typingUser,
    }
}
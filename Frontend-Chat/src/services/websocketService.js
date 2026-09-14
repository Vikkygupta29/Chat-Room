import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const SOCKET_URL = 'http://localhost:8080/chat'

let client = null

export function connectToRoom(roomId, onMessage, onConnected, onError) {
    client = new Client({
        webSocketFactory: () => new SockJS(SOCKET_URL),

        reconnectDelay: 5000,

        onConnect: () => {
            console.log('WebSocket connected')

            client.subscribe(
                `/topic/room/${roomId}`,
                (message) => {
                    try {
                        const data = JSON.parse(message.body)
                        onMessage(data)
                    } catch (error) {
                        console.error(
                            'Failed to parse WebSocket message:',
                            error,
                        )
                    }
                },
            )

            if (onConnected) {
                onConnected()
            }
        },

        onStompError: (frame) => {
            console.error(
                'STOMP error:',
                frame.headers['message'],
            )

            if (onError) {
                onError(frame)
            }
        },

        onWebSocketError: (error) => {
            console.error('WebSocket error:', error)

            if (onError) {
                onError(error)
            }
        },
    })

    client.activate()

    return client
}

export function sendMessage(roomId, message) {
    if (!client || !client.connected) {
        console.error('WebSocket is not connected')
        return false
    }

    client.publish({
        destination: `/app/sendMessages/${roomId}`,
        body: JSON.stringify(message),
    })

    return true
}

export function sendDeleteMessage(roomId, message) {
    if (!client || !client.connected) {
        console.error('WebSocket is not connected')
        return false
    }

    client.publish({
        destination: `/app/deleteMessage/${roomId}`,
        body: JSON.stringify(message),
    })

    return true
}

export function disconnectFromRoom() {
    if (client) {
        client.deactivate()
        client = null
    }
}

export function sendTyping(roomId, sender, typing) {
    if (!client || !client.connected) {
        return false
    }

    client.publish({
        destination: `/app/sendMessages/${roomId}`,
        body: JSON.stringify({
            sender,
            content: typing ? 'typing' : '',
            type: 'TYPING',
        }),
    })

    return true
}
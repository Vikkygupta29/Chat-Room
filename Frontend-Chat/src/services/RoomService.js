import api from './api'

export async function getRoom(roomId) {
    const response = await api.get(`/api/v1/rooms/${roomId}`)
    return response.data
}

export async function getRoomMessages(roomId) {
    const response = await api.get(`/api/v1/rooms/${roomId}/messages`)
    return response.data
}

export async function createRoom(roomId) {
    const response = await api.post('/api/v1/rooms', {
        roomId,
    })

    return response.data
}

export async function getAllRooms() {
    const response = await api.get('/api/v1/rooms')
    return response.data
}

export async function deleteMessage(roomId, messageId) {
    const response = await api.delete(
        `/api/v1/rooms/${roomId}/messages/${messageId}`,
    )

    return response.data
}
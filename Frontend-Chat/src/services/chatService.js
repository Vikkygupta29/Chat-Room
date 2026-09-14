import api from './api'

export async function uploadChatFile(file) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(
        '/api/v1/chat/upload',
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        },
    )

    return response.data
}
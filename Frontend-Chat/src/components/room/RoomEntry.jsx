import { useState } from 'react'
import { Hash, LogIn, Plus, Server, User } from 'lucide-react'
import { getRoom, createRoom } from '../../services/roomService'

export default function RoomEntry({ onRoomEnter }) {
    const [userName, setUserName] = useState('')
    const [roomId, setRoomId] = useState('')
    const [creating, setCreating] = useState(false)
    const [error, setError] = useState('')

    async function handleJoinRoom() {
        const trimmedName = userName.trim()
        const trimmedRoomId = roomId.trim().toLowerCase()

        if (!trimmedName) {
            setError('Please enter your display name.')
            return
        }

        if (!trimmedRoomId) {
            setError('Please enter the Room ID.')
            return
        }

        try {
            setError('')

            // Join only validates an existing room.
            await getRoom(trimmedRoomId)

            onRoomEnter({
                roomId: trimmedRoomId,
                userName: trimmedName,
            })
        } catch (error) {
            console.error('Failed to join room:', error)

            setError(
                error.response?.data ||
                'Room not found. Please check the Room ID.',
            )
        }
    }

    async function handleCreateRoom() {
        const trimmedName = userName.trim()
        const trimmedRoomId = roomId.trim().toLowerCase()

        if (!trimmedName) {
            setError('Please enter your display name.')
            return
        }

        if (!trimmedRoomId) {
            setError('Please choose a Room ID.')
            return
        }

        const roomIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

        if (!roomIdPattern.test(trimmedRoomId)) {
            setError(
                'Use lowercase letters, numbers, and hyphens only.',
            )
            return
        }

        if (trimmedRoomId.length > 30) {
            setError('Room ID must be 30 characters or less.')
            return
        }

        try {
            setCreating(true)
            setError('')

            // Create a completely new room.
            await createRoom(trimmedRoomId)

            onRoomEnter({
                roomId: trimmedRoomId,
                userName: trimmedName,
            })
        } catch (error) {
            console.error('Failed to create room:', error)

            setError(
                error.response?.data ||
                'Unable to create room. The Room ID may already exist.',
            )
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="flex min-h-full items-center justify-center bg-[#0b0d12] px-6 py-12">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-bold text-white shadow-xl shadow-indigo-500/20">
                        R
                    </div>

                    <h1 className="text-2xl font-semibold text-white">
                        Welcome to ResilienceChat
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter your name and a room to start chatting.
                    </p>
                </div>

                {/* Entry card */}
                <div className="rounded-2xl border border-white/10 bg-[#10131a] p-6 shadow-2xl shadow-black/20">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                            <Server size={18} />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-200">
                                Enter ResilienceChat
                            </h2>

                            <p className="text-xs text-slate-500">
                                Choose how you want to enter.
                            </p>
                        </div>
                    </div>

                    {/* Display name */}
                    <label className="mb-2 block text-xs font-medium text-slate-400">
                        Display name
                    </label>

                    <div className="relative">
                        <User
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="text"
                            value={userName}
                            onChange={(event) => {
                                setUserName(event.target.value)
                                setError('')
                            }}
                            placeholder="e.g. Vikky"
                            maxLength={30}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0d12] pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                        />
                    </div>

                    {/* Room ID */}
                    <label className="mb-2 mt-5 block text-xs font-medium text-slate-400">
                        Room ID
                    </label>

                    <div className="relative">
                        <Hash
                            size={17}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                        />

                        <input
                            type="text"
                            value={roomId}
                            onChange={(event) => {
                                setRoomId(event.target.value)
                                setError('')
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleJoinRoom()
                                }
                            }}
                            placeholder="e.g. general"
                            maxLength={30}
                            className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0d12] pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                        />
                    </div>

                    {error && (
                        <p className="mt-2 text-xs text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Join existing room */}
                    <button
                        type="button"
                        onClick={handleJoinRoom}
                        disabled={
                            !userName.trim() ||
                            !roomId.trim() ||
                            creating
                        }
                        className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <LogIn size={17} />
                        Join Room
                    </button>

                    <p className="mt-2 text-center text-[10px] text-slate-600">
                        Enter the ID of an existing room.
                    </p>

                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/5" />

                        <span className="text-[10px] uppercase tracking-wider text-slate-600">
                            or
                        </span>

                        <div className="h-px flex-1 bg-white/5" />
                    </div>

                    {/* Create new room */}
                    <button
                        type="button"
                        onClick={handleCreateRoom}
                        disabled={
                            !userName.trim() ||
                            !roomId.trim() ||
                            creating
                        }
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Plus size={17} />

                        {creating
                            ? 'Creating Room...'
                            : 'Create Room'}
                    </button>

                    <p className="mt-2 text-center text-[10px] text-slate-600">
                        Choose a unique ID for a new room.
                    </p>
                </div>

                <p className="mt-6 text-center text-[11px] text-slate-600">
                    ResilienceChat
                </p>
            </div>
        </div>
    )
}
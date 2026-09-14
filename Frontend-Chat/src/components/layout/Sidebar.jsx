



import { useState } from 'react'
import {
    ChevronDown,
    Hash,
    MessageSquare,
    LogOut,
    Plus,
    Settings,
    X,
} from 'lucide-react'
import { createRoom } from '../../services/roomService'

export default function Sidebar({
    activeRoom,
    onRoomChange,
    rooms,
    onRoomCreated,
    activePage,
    onPageChange,
    userName,
    onLogout,
}) {
    const [showCreateRoom, setShowCreateRoom] = useState(false)
    const [roomName, setRoomName] = useState('')
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')

    async function handleCreateRoom() {
        const trimmedName = roomName.trim().toLowerCase()

        if (!trimmedName || creating) {
            return
        }

        const roomNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

        if (!roomNamePattern.test(trimmedName)) {
            setCreateError(
                'Use lowercase letters, numbers, and hyphens only.',
            )
            return
        }

        if (trimmedName.length > 30) {
            setCreateError(
                'Room name must be 30 characters or less.',
            )
            return
        }

        if (rooms.includes(trimmedName)) {
            setCreateError('Room already exists.')
            return
        }

        try {
            setCreating(true)
            setCreateError('')

            await createRoom(trimmedName)

            onRoomCreated(trimmedName)

            setRoomName('')
            setShowCreateRoom(false)
        } catch (error) {
            console.error('Failed to create room:', error)

            setCreateError(
                error.response?.data ||
                'Unable to create room.',
            )
        } finally {
            setCreating(false)
        }
    }

    return (
        <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#10131a]">

            {/* Workspace Header */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                        R
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-sm font-semibold text-white">
                            ResilienceChat
                        </h1>

                        <p className="truncate text-[11px] text-slate-500">
                            Chat workspace
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                    title="Workspace menu"
                >
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Navigation */}
            <div className="px-3 py-4">
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    Navigation
                </p>

                <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg bg-indigo-500/10 px-3 py-2.5 text-sm text-indigo-300 ring-1 ring-inset ring-indigo-500/20"
                >
                    <MessageSquare
                        size={17}
                        className="text-indigo-400"
                    />

                    <span className="flex-1 text-left">
                        Messages
                    </span>

                    <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
                        {rooms.length}
                    </span>
                </button>
            </div>

            {/* Rooms */}
            <div className="min-h-0 flex-1 overflow-y-auto px-3">
                <div className="mb-2 flex items-center justify-between px-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                        Rooms
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setCreateError('')
                            setRoomName('')
                            setShowCreateRoom(true)
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-slate-600 transition hover:bg-white/5 hover:text-white"
                        title="Create room"
                    >
                        <Plus size={15} />
                    </button>
                </div>

                <div className="space-y-1">
                    {rooms.length === 0 ? (
                        <div className="px-3 py-6 text-center">
                            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                                <Hash
                                    size={16}
                                    className="text-slate-600"
                                />
                            </div>

                            <p className="text-xs text-slate-600">
                                No rooms yet
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    setCreateError('')
                                    setRoomName('')
                                    setShowCreateRoom(true)
                                }}
                                className="mt-2 text-[11px] text-indigo-400 transition hover:text-indigo-300"
                            >
                                Create a room
                            </button>
                        </div>
                    ) : (
                        rooms.map((room) => {
                            const isActive = activeRoom === room

                            return (
                                <button
                                    key={room}
                                    type="button"
                                    onClick={() => {
                                        onRoomChange(room)
                                        onPageChange('messages')
                                    }}
                                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/20'
                                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                                        }`}
                                >
                                    <Hash
                                        size={16}
                                        className={`shrink-0 ${isActive
                                            ? 'text-indigo-400'
                                            : 'text-slate-600 group-hover:text-slate-400'
                                            }`}
                                    />

                                    <span className="min-w-0 flex-1 truncate">
                                        {room}
                                    </span>

                                    {isActive && (
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50" />
                                    )}
                                </button>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Bottom Area */}
            <div className="border-t border-white/10 p-3">

                {/* Settings */}
                <button
                    type="button"
                    onClick={() => onPageChange('settings')}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${activePage === 'settings'
                        ? 'bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/20'
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <Settings size={17} />

                    <span>Settings</span>
                </button>

                {/* User */}
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
                    <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-semibold text-white">
                            {userName.charAt(0)}
                        </div>

                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#10131a] bg-emerald-400" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-200">
                            {userName}
                        </p>

                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-emerald-400/80">
                                Online
                            </span>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#151922] p-5 shadow-2xl shadow-black/40">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Create a room
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    Add a new space for your
                                    conversation.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateRoom(false)
                                }
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                                title="Close"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <label className="mb-2 block text-xs font-medium text-slate-400">
                            Room name
                        </label>

                        <input
                            type="text"
                            value={roomName}
                            onChange={(event) => {
                                setRoomName(event.target.value)
                                setCreateError('')
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    handleCreateRoom()
                                }
                            }}
                            placeholder="e.g. backend"
                            autoFocus
                            className="w-full rounded-xl border border-white/10 bg-[#0b0d12] px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10"
                        />

                        {createError && (
                            <p className="mt-2 text-xs text-red-400">
                                {createError}
                            </p>
                        )}

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateRoom(false)
                                }
                                className="rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleCreateRoom}
                                disabled={
                                    !roomName.trim() ||
                                    creating
                                }
                                className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {creating
                                    ? 'Creating...'
                                    : 'Create room'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
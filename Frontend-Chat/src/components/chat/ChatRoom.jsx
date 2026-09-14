import { useEffect, useRef, useState } from 'react'
import {
    Hash,
    LoaderCircle,
    Search,
    X,
} from 'lucide-react'

import Message from './Message'
import useRoom from '../../hooks/useRoom'
import { deleteMessage } from '../../services/roomService'
import {
    sendDeleteMessage,
    sendMessage,
    sendTyping,
} from '../../services/websocketService'
import { uploadChatFile } from '../../services/chatService'

function getSearchableContent(message) {
    if (!message) return ''

    let content = message.content || ''

    if (
        message.type === 'IMAGE' ||
        message.type === 'VIDEO' ||
        message.type === 'FILE'
    ) {
        const rawName = decodeURIComponent(
            content.split('/').pop() || '',
        )

        const separatorIndex = rawName.indexOf('_')

        if (separatorIndex >= 0) {
            content = rawName.slice(separatorIndex + 1)
        } else {
            content = rawName
        }
    }

    return `${message.sender || ''} ${content}`.toLowerCase()
}

export default function ChatRoom({ roomId, userName }) {
    const [content, setContent] = useState('')
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)

    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)

    const {
        room,
        messages,
        loading,
        error,
        connected,
        removeMessage,
        typingUser,
    } = useRoom(roomId, userName)

    const visibleMessages = messages.filter((message) => {
        const query = searchQuery.trim().toLowerCase()

        if (!query) return true

        return getSearchableContent(message).includes(query)
    })

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        })
    }, [messages])

    useEffect(() => {
        function handleSearchShortcut(event) {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key === 'k'
            ) {
                event.preventDefault()
                setSearchOpen(true)
            }

            if (event.key === 'Escape' && searchOpen) {
                closeSearch()
            }
        }

        window.addEventListener(
            'keydown',
            handleSearchShortcut,
        )

        return () => {
            window.removeEventListener(
                'keydown',
                handleSearchShortcut,
            )
        }
    }, [searchOpen])

    async function handleFileSelect(event) {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        try {
            setUploading(true)

            const fileUrl = await uploadChatFile(file)

            setSelectedFile({
                name: file.name,
                url: fileUrl,
                type: file.type,
            })

            console.log(
                'File uploaded successfully:',
                file.name,
            )
        } catch (error) {
            console.error(
                'File upload failed:',
                error,
            )
        } finally {
            setUploading(false)
            event.target.value = ''
        }
    }

    function removeSelectedFile() {
        setSelectedFile(null)
    }

    function handleReply(message) {
        setReplyingTo(message)
        setContent(`@${message.sender} `)
    }

    async function handleDelete(message) {
        if (!message?.id) {
            console.error(
                'Cannot delete message: message ID is missing',
            )
            return
        }

        try {
            await deleteMessage(roomId, message.id)

            removeMessage(message.id)

            sendDeleteMessage(roomId, {
                id: message.id,
            })
        } catch (error) {
            console.error(
                'Failed to delete message:',
                error,
            )
        }
    }

    function handleEmojiSelect(emoji) {
        setContent(
            (currentContent) => currentContent + emoji,
        )

        setShowEmojiPicker(false)
    }

    function closeSearch() {
        setSearchOpen(false)
        setSearchQuery('')
    }

    function handleSend() {
        const trimmedContent = content.trim()

        if (
            (!trimmedContent && !selectedFile) ||
            !connected ||
            uploading
        ) {
            return
        }

        let messageContent = trimmedContent
        let messageType = 'CHAT'

        if (selectedFile) {
            messageContent = selectedFile.url

            if (selectedFile.type.startsWith('image/')) {
                messageType = 'IMAGE'
            } else if (
                selectedFile.type.startsWith('video/')
            ) {
                messageType = 'VIDEO'
            } else {
                messageType = 'FILE'
            }
        }

        const sent = sendMessage(roomId, {
            content: messageContent,
            sender: userName,
            roomId,
            type: messageType,
        })

        if (sent) {
            setContent('')
            setSelectedFile(null)
            setReplyingTo(null)

            clearTimeout(window.typingTimer)

            sendTyping(
                roomId,
                userName,
                false,
            )
        }
    }

    return (
        <section className="flex h-full min-h-0 flex-col bg-[#0b0d12]">

            {/* Chat header */}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                        <Hash
                            size={19}
                            className="text-indigo-400"
                        />
                    </div>

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold text-white">
                                {room?.roomId || roomId}
                            </h2>

                            <span className="h-1 w-1 rounded-full bg-slate-600" />

                            <span
                                className={`text-xs ${connected
                                        ? 'text-emerald-400'
                                        : 'text-slate-500'
                                    }`}
                            >
                                {connected
                                    ? 'Live'
                                    : 'Connecting...'}
                            </span>
                        </div>

                        <p className="text-xs text-slate-500">
                            {roomId === 'general'
                                ? 'General discussion'
                                : `${roomId.charAt(0).toUpperCase()}${roomId.slice(1)} discussion`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {searchOpen ? (
                        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2">
                            <Search
                                size={15}
                                className="text-slate-500"
                            />

                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(
                                        event.target.value,
                                    )
                                }
                                placeholder="Search messages..."
                                autoFocus
                                className="h-8 w-40 bg-transparent text-xs text-slate-200 outline-none placeholder:text-slate-600"
                            />

                            {searchQuery.trim() && (
                                <span className="whitespace-nowrap text-[10px] text-slate-500">
                                    {visibleMessages.length}{' '}
                                    {visibleMessages.length === 1
                                        ? 'result'
                                        : 'results'}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={closeSearch}
                                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/5 hover:text-white"
                                title="Close search"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                setSearchOpen(true)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                            title="Search"
                        >
                            <Search size={17} />
                        </button>
                    )}
                </div>
            </header>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto py-6">
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                            <LoaderCircle
                                size={18}
                                className="animate-spin text-indigo-400"
                            />

                            Loading messages...
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center px-6">
                        <div className="max-w-md text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                                !
                            </div>

                            <h3 className="text-sm font-semibold text-white">
                                Unable to load this room
                            </h3>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                {typeof error === 'string'
                                    ? error
                                    : 'Make sure the Spring Boot backend is running.'}
                            </p>
                        </div>
                    </div>
                ) : visibleMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center px-6">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                                <Hash size={22} />
                            </div>

                            <h3 className="text-sm font-semibold text-white">
                                {searchQuery.trim()
                                    ? 'No matching messages'
                                    : 'No messages yet'}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                {searchQuery.trim()
                                    ? 'Try a different search term.'
                                    : 'Be the first person to start the conversation.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {visibleMessages.map(
                            (message, index) => (
                                <Message
                                    key={`${message.id || message.timeStamp}-${index}`}
                                    message={message}
                                    onReply={handleReply}
                                    onDelete={handleDelete}
                                />
                            ),
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Remote typing indicator */}
            {typingUser && (
                <div className="mb-1 flex items-center gap-2 pl-8 text-[11px] text-slate-500">
                    <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" />
                    </span>

                    <span>
                        {typingUser} is typing...
                    </span>
                </div>
            )}

            {/* Composer */}
            <div className="shrink-0 px-6 pb-5 pt-2">
                <div className="rounded-2xl border border-white/10 bg-[#151922] shadow-xl shadow-black/10">

                    {/* Selected file */}
                    {selectedFile && (
                        <div className="mx-3 mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                            <div className="flex min-w-0 items-center gap-3">
                                {selectedFile.type.startsWith(
                                    'image/',
                                ) ? (
                                    <img
                                        src={selectedFile.url}
                                        alt={selectedFile.name}
                                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-semibold uppercase text-indigo-400">
                                        {selectedFile.type ===
                                            'application/pdf'
                                            ? 'PDF'
                                            : 'FILE'}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p
                                        className="truncate text-xs font-medium text-slate-200"
                                        title={selectedFile.name}
                                    >
                                        {selectedFile.name}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-emerald-400">
                                        Ready to send
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    removeSelectedFile
                                }
                                className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                                title="Remove attachment"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    )}

                    {/* Reply */}
                    {replyingTo && (
                        <div className="mx-3 mt-3 flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-3 py-2">
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-indigo-400">
                                    Replying to{' '}
                                    {replyingTo.sender}
                                </p>

                                <p className="truncate text-xs text-slate-400">
                                    {replyingTo.type ===
                                        'CHAT'
                                        ? replyingTo.content
                                        : 'Attachment'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setReplyingTo(null)
                                }
                                className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                                title="Cancel reply"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* Text input */}
                    <textarea
                        rows="2"
                        maxLength={2000}
                        value={content}
                        onChange={(event) => {
                            const value =
                                event.target.value

                            setContent(value)

                            if (userName?.trim()) {
                                sendTyping(
                                    roomId,
                                    userName,
                                    Boolean(
                                        value.trim(),
                                    ),
                                )
                            }

                            clearTimeout(
                                window.typingTimer,
                            )

                            if (value.trim()) {
                                window.typingTimer =
                                    setTimeout(() => {
                                        sendTyping(
                                            roomId,
                                            userName,
                                            false,
                                        )
                                    }, 1200)
                            }

                            event.target.style.height =
                                'auto'

                            event.target.style.height = `${Math.min(
                                event.target
                                    .scrollHeight,
                                160,
                            )}px`
                        }}
                        onKeyDown={(event) => {
                            if (
                                event.key === 'Enter' &&
                                !event.shiftKey &&
                                !event.ctrlKey &&
                                !event.altKey
                            ) {
                                event.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder={`Message #${room?.roomId || roomId
                            }...`}
                        className="block max-h-40 min-h-12 w-full resize-none overflow-y-auto bg-transparent px-4 pt-4 text-sm text-slate-200 outline-none placeholder:text-slate-600"
                    />

                    <div className="flex justify-end px-4 pb-1">
                        <span className="text-[10px] text-slate-600">
                            {content.length}/2000
                        </span>
                    </div>

                    {/* Composer actions */}
                    <div className="flex items-center justify-between px-3 pb-3 pt-2">
                        <div className="flex items-center gap-1">

                            {/* Emoji */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEmojiPicker(
                                            (previous) =>
                                                !previous,
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
                                    title="Add emoji"
                                >
                                    😊
                                </button>

                                {showEmojiPicker && (
                                    <div className="absolute bottom-10 left-0 z-50 w-64 rounded-xl border border-white/10 bg-[#151922] p-3 shadow-2xl">
                                        <div className="grid grid-cols-8 gap-1">
                                            {[
                                                '😀',
                                                '😂',
                                                '😍',
                                                '🥰',
                                                '😊',
                                                '😎',
                                                '🤔',
                                                '😢',
                                                '😭',
                                                '😡',
                                                '🤗',
                                                '👍',
                                                '👎',
                                                '👏',
                                                '🙌',
                                                '❤️',
                                                '🔥',
                                                '🎉',
                                                '✨',
                                                '💯',
                                                '🚀',
                                                '💻',
                                                '☕',
                                                '😄',
                                            ].map(
                                                (
                                                    emoji,
                                                ) => (
                                                    <button
                                                        key={
                                                            emoji
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handleEmojiSelect(
                                                                emoji,
                                                            )
                                                        }
                                                        className="flex h-7 w-7 items-center justify-center rounded-md text-lg transition hover:bg-white/10"
                                                    >
                                                        {
                                                            emoji
                                                        }
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Attachment */}
                            <>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={
                                        handleFileSelect
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Attach file"
                                >
                                    📎
                                </button>
                            </>
                        </div>

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={
                                !connected ||
                                uploading ||
                                (!content.trim() &&
                                    !selectedFile)
                            }
                            className="rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {uploading
                                ? 'Uploading...'
                                : 'Send'}
                        </button>
                    </div>
                </div>

                <p className="mt-2 text-center text-[10px] text-slate-600">
                    Press Enter to send · Shift + Enter for a new line
                </p>
            </div>
        </section>
    )
}
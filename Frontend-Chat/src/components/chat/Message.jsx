import { FileText } from 'lucide-react'
import MessageActions from './MessageActions'

function formatTime(timestamp) {
    if (!timestamp) return ''

    const date = new Date(timestamp)

    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
}

function getAttachmentName(url) {
    const rawName = decodeURIComponent(
        url?.split('/').pop() || 'Attachment',
    )

    const separatorIndex = rawName.indexOf('_')

    return separatorIndex >= 0
        ? rawName.slice(separatorIndex + 1)
        : rawName
}

function getFileExtension(url) {
    const fileName = getAttachmentName(url)
    const dotIndex = fileName.lastIndexOf('.')

    return dotIndex >= 0
        ? fileName.slice(dotIndex + 1).toUpperCase()
        : 'FILE'
}

export default function Message({
    message,
    onReply,
    onDelete,
    showHeader = true,
}) {
    const isJoin = message.type === 'JOIN'
    const isLeave = message.type === 'LEAVE'

    const isImage = message.type === 'IMAGE'
    const isVideo = message.type === 'VIDEO'
    const isFile = message.type === 'FILE'

    // System messages
    if (isJoin || isLeave) {
        return (
            <div className="flex items-center gap-3 px-6 py-3">
                <div className="h-px flex-1 bg-white/5" />

                <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5">
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${isJoin
                                ? 'bg-emerald-400'
                                : 'bg-slate-500'
                            }`}
                    />

                    <span className="text-[11px] font-medium text-slate-500">
                        {message.content}
                    </span>

                    <span className="text-[10px] text-slate-700">
                        {formatTime(message.timeStamp)}
                    </span>
                </div>

                <div className="h-px flex-1 bg-white/5" />
            </div>
        )
    }

    return (
        <div className="group flex gap-3 px-6 py-2 transition hover:bg-white/[0.02]">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
                {message.sender?.charAt(0).toUpperCase() || '?'}
            </div>

            <div className="min-w-0 max-w-xl">
                {showHeader && (
                    <div className="mb-1 flex items-center gap-2">
                        <span
                            className="whitespace-nowrap text-sm font-medium text-slate-200"
                            title={message.sender || 'Unknown'}
                        >
                            {message.sender || 'Unknown'}
                        </span>

                        <span className="text-[11px] text-slate-600">
                            {formatTime(message.timeStamp)}
                        </span>

                        <MessageActions
                            message={message}
                            onReply={onReply}
                            onDelete={onDelete}
                        />
                    </div>
                )}

                {isImage ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
                        <img
                            src={message.content}
                            alt="Attachment"
                            className="max-h-80 max-w-md object-contain"
                        />
                    </div>
                ) : isVideo ? (
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
                        <video
                            src={message.content}
                            controls
                            className="max-h-80 max-w-md"
                        >
                            Your browser does not support video playback.
                        </video>
                    </div>
                ) : isFile ? (
                    (() => {
                        const fileName = getAttachmentName(
                            message.content,
                        )

                        const fileType = getFileExtension(
                            message.content,
                        )

                        return (
                            <div className="group/file flex max-w-md items-center gap-3 rounded-xl border border-white/10 bg-[#151922] px-4 py-3 transition hover:border-indigo-500/30 hover:bg-[#191d27]">
                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/10">
                                    <FileText size={20} />

                                    <span className="absolute -bottom-1 -right-1 rounded-md bg-[#0b0d12] px-1.5 py-0.5 text-[8px] font-bold leading-none text-indigo-400 ring-1 ring-white/10">
                                        {fileType}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="truncate text-sm font-medium text-slate-200"
                                        title={fileName}
                                    >
                                        {fileName}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-500">
                                        {fileType} file
                                    </p>
                                </div>

                                <a
                                    href={message.content}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="shrink-0 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400"
                                >
                                    Open
                                </a>
                            </div>
                        )
                    })()
                ) : (
                    <div className="break-words text-sm leading-6 text-slate-300">
                        {message.content}
                    </div>
                )}
            </div>
        </div>
    )
}
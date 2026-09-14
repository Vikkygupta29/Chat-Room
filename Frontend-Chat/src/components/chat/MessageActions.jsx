
// import { Copy, MoreHorizontal, Reply, Trash2 } from 'lucide-react'
// import { useEffect, useRef, useState } from 'react'

// export default function MessageActions({
//     message,
//     onReply,
//     onDelete,
// }) {
//     const [open, setOpen] = useState(false)
//     const actionsRef = useRef(null)

//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (
//                 actionsRef.current &&
//                 !actionsRef.current.contains(event.target)
//             ) {
//                 setOpen(false)
//             }
//         }

//         document.addEventListener(
//             'mousedown',
//             handleClickOutside,
//         )

//         return () => {
//             document.removeEventListener(
//                 'mousedown',
//                 handleClickOutside,
//             )
//         }
//     }, [])

//     async function handleCopy() {
//         if (!message?.content) return

//         try {
//             let textToCopy = message.content

//             if (
//                 message.type === 'IMAGE' ||
//                 message.type === 'VIDEO' ||
//                 message.type === 'FILE'
//             ) {
//                 const rawName = decodeURIComponent(
//                     message.content.split('/').pop() || 'Attachment',
//                 )

//                 const separatorIndex = rawName.indexOf('_')

//                 textToCopy =
//                     separatorIndex >= 0
//                         ? rawName.slice(separatorIndex + 1)
//                         : rawName
//             }

//             await navigator.clipboard.writeText(textToCopy)
//             setOpen(false)
//         } catch (error) {
//             console.error('Failed to copy message:', error)
//         }
//     }

//     function handleReply() {
//         if (onReply) {
//             onReply(message)
//         }

//         setOpen(false)
//     }

//     function handleDelete() {
//         if (onDelete) {
//             onDelete(message)
//         }

//         setOpen(false)
//     }

//     return (
//         <div
//             ref={actionsRef}
//             className="relative"
//         >
//             <button
//                 type="button"
//                 onClick={() =>
//                     setOpen((previous) => !previous)
//                 }
//                 className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#151922] text-slate-500 opacity-0 shadow-lg ring-1 ring-white/10 transition hover:bg-[#1d2230] hover:text-white group-hover:opacity-100"
//                 title="Message actions"
//             >
//                 <MoreHorizontal size={15} />
//             </button>

//             {open && (
//                 <div className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#151922] p-1.5 shadow-2xl shadow-black/30">
//                     <button
//                         type="button"
//                         onClick={handleCopy}
//                         className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
//                     >
//                         <Copy size={14} />
//                         Copy
//                     </button>

//                     <button
//                         type="button"
//                         onClick={handleReply}
//                         className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
//                     >
//                         <Reply size={14} />
//                         Reply
//                     </button>

//                     <div className="my-1 border-t border-white/5" />

//                     <button
//                         type="button"
//                         onClick={handleDelete}
//                         className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
//                     >
//                         <Trash2 size={14} />
//                         Delete
//                     </button>
//                 </div>
//             )}
//         </div>
//     )
// }











import {
    Copy,
    MoreHorizontal,
    Reply,
    Trash2,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function MessageActions({
    message,
    onReply,
    onDelete,
}) {
    const [open, setOpen] = useState(false)
    const actionsRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                actionsRef.current &&
                !actionsRef.current.contains(event.target)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            )
        }
    }, [])

    async function handleCopy() {
        if (!message?.content) {
            return
        }

        try {
            let textToCopy = message.content

            if (
                message.type === 'IMAGE' ||
                message.type === 'VIDEO' ||
                message.type === 'FILE'
            ) {
                const rawName = decodeURIComponent(
                    message.content.split('/').pop() ||
                    'Attachment',
                )

                const separatorIndex = rawName.indexOf('_')

                textToCopy =
                    separatorIndex >= 0
                        ? rawName.slice(separatorIndex + 1)
                        : rawName
            }

            await navigator.clipboard.writeText(textToCopy)
            setOpen(false)
        } catch (error) {
            console.error(
                'Failed to copy message:',
                error,
            )
        }
    }

    function handleReply() {
        if (onReply) {
            onReply(message)
        }

        setOpen(false)
    }

    function handleDelete() {
        if (onDelete) {
            onDelete(message)
        }

        setOpen(false)
    }

    return (
        <div
            ref={actionsRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() =>
                    setOpen((previous) => !previous)
                }
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#151922] text-slate-500 opacity-0 shadow-lg ring-1 ring-white/10 transition hover:bg-[#1d2230] hover:text-white group-hover:opacity-100"
                title="Message actions"
            >
                <MoreHorizontal size={15} />
            </button>

            {open && (
                <div className="absolute right-0 top-8 z-50 w-40 overflow-hidden rounded-xl border border-white/10 bg-[#151922] p-1.5 shadow-2xl shadow-black/30">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        <Copy size={14} />
                        Copy
                    </button>

                    <button
                        type="button"
                        onClick={handleReply}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                        <Reply size={14} />
                        Reply
                    </button>

                    <div className="my-1 border-t border-white/5" />

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}



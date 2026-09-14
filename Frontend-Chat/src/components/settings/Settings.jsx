// import { useState, useEffect } from 'react'
// import { getSettings, saveSettings } from '../../services/settingsService'

// export default function Settings() {
//     const savedSettings = getSettings()

//     const [notificationsEnabled, setNotificationsEnabled] = useState(
//         savedSettings.notificationsEnabled,
//     )

//     const [enterToSendEnabled, setEnterToSendEnabled] = useState(
//         savedSettings.enterToSendEnabled,
//     )

//     const [theme, setTheme] = useState(
//         savedSettings.theme || 'dark',
//     )

//     useEffect(() => {
//         document.documentElement.classList.toggle(
//             'light',
//             theme === 'light',
//         )
//     }, [theme])


//     return (
//         <div
//             className={`h-full overflow-y-auto ${theme === 'light'
//                     ? 'bg-slate-50 text-slate-900'
//                     : 'bg-[#0b0d12] text-white'
//                 }`}
//         >
//             <div className="mx-auto max-w-4xl px-8 py-8">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-xl font-semibold text-white">
//                         Settings
//                     </h1>

//                     <p className="mt-1 text-sm text-slate-500">
//                         Manage your chat workspace preferences.
//                     </p>
//                 </div>

//                 {/* Appearance */}
//                 <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
//                     <div className="border-b border-white/10 px-5 py-4">
//                         <h2 className="text-sm font-semibold text-slate-200">
//                             Appearance
//                         </h2>

//                         <p className="mt-1 text-xs text-slate-500">
//                             Customize how the workspace looks.
//                         </p>
//                     </div>

//                     <div className="flex items-center justify-between px-5 py-4">
//                         <div>
//                             <p className="text-sm text-slate-300">
//                                 Theme
//                             </p>

//                             <p className="mt-1 text-xs text-slate-600">
//                                 {theme === 'dark'
//                                     ? 'Dark mode is currently active.'
//                                     : 'Light mode is currently active.'}
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setTheme((currentTheme) => {
//                                     const newTheme =
//                                         currentTheme === 'dark' ? 'light' : 'dark'

//                                     saveSettings({
//                                         ...getSettings(),
//                                         theme: newTheme,
//                                     })

//                                     document.documentElement.classList.toggle(
//                                         'light',
//                                         newTheme === 'light',
//                                     )

//                                     window.dispatchEvent(new Event('themechange'))

//                                     return newTheme
//                                 })
//                             }}
//                             className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${theme === 'dark'
//                                 ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
//                                 : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
//                                 }`}
//                         >
//                             {theme === 'dark' ? 'Dark' : 'Light'}
//                         </button>
//                     </div>
//                 </section>

//                 {/* Notifications */}
//                 <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
//                     <div className="border-b border-white/10 px-5 py-4">
//                         <h2 className="text-sm font-semibold text-slate-200">
//                             Notifications
//                         </h2>

//                         <p className="mt-1 text-xs text-slate-500">
//                             Control workspace notification preferences.
//                         </p>
//                     </div>

//                     <div className="flex items-center justify-between px-5 py-4">
//                         <div>
//                             <p className="text-sm text-slate-300">
//                                 Message notifications
//                             </p>

//                             <p className="mt-1 text-xs text-slate-600">
//                                 {notificationsEnabled
//                                     ? 'Receive notifications for new messages.'
//                                     : 'Message notifications are turned off.'}
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setNotificationsEnabled((enabled) => {
//                                     const newValue = !enabled

//                                     saveSettings({
//                                         ...getSettings(),
//                                         notificationsEnabled: newValue,
//                                     })

//                                     return newValue
//                                 })
//                             }}
//                             className={`h-5 w-9 rounded-full p-0.5 transition ${notificationsEnabled
//                                 ? 'bg-indigo-500'
//                                 : 'bg-slate-700'
//                                 }`}
//                         >
//                             <div
//                                 className={`h-4 w-4 rounded-full bg-white transition ${notificationsEnabled
//                                     ? 'ml-auto'
//                                     : 'ml-0'
//                                     }`}
//                             />
//                         </button>
//                     </div>
//                 </section>

//                 {/* Chat Preferences */}
//                 <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
//                     <div className="border-b border-white/10 px-5 py-4">
//                         <h2 className="text-sm font-semibold text-slate-200">
//                             Chat preferences
//                         </h2>

//                         <p className="mt-1 text-xs text-slate-500">
//                             Configure how messages are sent.
//                         </p>
//                     </div>

//                     <div className="flex items-center justify-between px-5 py-4">
//                         <div>
//                             <p className="text-sm text-slate-300">
//                                 Enter to send
//                             </p>

//                             <p className="mt-1 text-xs text-slate-600">
//                                 {enterToSendEnabled
//                                     ? 'Press Enter to send a message.'
//                                     : 'Press Enter to add a new line.'}
//                             </p>
//                         </div>

//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setEnterToSendEnabled((enabled) => {
//                                     const newValue = !enabled

//                                     saveSettings({
//                                         ...getSettings(),
//                                         enterToSendEnabled: newValue,
//                                     })

//                                     return newValue
//                                 })
//                             }}
//                             className={`h-5 w-9 rounded-full p-0.5 transition ${enterToSendEnabled
//                                 ? 'bg-emerald-500'
//                                 : 'bg-slate-700'
//                                 }`}
//                         >
//                             <div
//                                 className={`h-4 w-4 rounded-full bg-white transition ${enterToSendEnabled
//                                     ? 'ml-auto'
//                                     : 'ml-0'
//                                     }`}
//                             />
//                         </button>
//                     </div>
//                 </section>

//                 {/* About */}
//                 <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
//                     <div className="border-b border-white/10 px-5 py-4">
//                         <h2 className="text-sm font-semibold text-slate-200">
//                             About
//                         </h2>

//                         <p className="mt-1 text-xs text-slate-500">
//                             Information about this workspace.
//                         </p>
//                     </div>

//                     <div className="flex items-center justify-between px-5 py-4">
//                         <div>
//                             <p className="text-sm font-medium text-slate-300">
//                                 ResilienceLab Chat
//                             </p>

//                             <p className="mt-1 text-xs text-slate-600">
//                                 Real-time chat workspace
//                             </p>
//                         </div>

//                         <span className="text-xs text-slate-600">
//                             v1.0
//                         </span>
//                     </div>
//                 </section>
//             </div>
//         </div>
//     )
// }


import { useState } from 'react'
import { getSettings, saveSettings } from '../../services/settingsService'

export default function Settings() {
    const savedSettings = getSettings()


    const [notificationsEnabled, setNotificationsEnabled] = useState(
        savedSettings.notificationsEnabled,
    )

    const [enterToSendEnabled, setEnterToSendEnabled] = useState(
        savedSettings.enterToSendEnabled,
    )

    return (
        <div className="h-full overflow-y-auto bg-[#0b0d12] text-white">
            <div className="mx-auto max-w-4xl px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-xl font-semibold text-white">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your chat workspace preferences.
                    </p>
                </div>

                {/* Notifications */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
                    <div className="border-b border-white/10 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-200">
                            Notifications
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Control workspace notification preferences.
                        </p>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <div>
                            <p className="text-sm text-slate-300">
                                Message notifications
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {notificationsEnabled
                                    ? 'Receive notifications for new messages.'
                                    : 'Message notifications are turned off.'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setNotificationsEnabled((enabled) => {
                                    const newValue = !enabled

                                    saveSettings({
                                        ...getSettings(),
                                        notificationsEnabled: newValue,
                                    })

                                    return newValue
                                })
                            }}
                            className={`h-5 w-9 rounded-full p-0.5 transition ${notificationsEnabled
                                    ? 'bg-indigo-500'
                                    : 'bg-slate-700'
                                }`}
                        >
                            <div
                                className={`h-4 w-4 rounded-full bg-white transition ${notificationsEnabled
                                        ? 'ml-auto'
                                        : 'ml-0'
                                    }`}
                            />
                        </button>
                    </div>
                </section>

                {/* Chat Preferences */}
                <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
                    <div className="border-b border-white/10 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-200">
                            Chat preferences
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Configure how messages are sent.
                        </p>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <div>
                            <p className="text-sm text-slate-300">
                                Enter to send
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                {enterToSendEnabled
                                    ? 'Press Enter to send a message.'
                                    : 'Press Enter to add a new line.'}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEnterToSendEnabled((enabled) => {
                                    const newValue = !enabled

                                    saveSettings({
                                        ...getSettings(),
                                        enterToSendEnabled: newValue,
                                    })

                                    return newValue
                                })
                            }}
                            className={`h-5 w-9 rounded-full p-0.5 transition ${enterToSendEnabled
                                    ? 'bg-emerald-500'
                                    : 'bg-slate-700'
                                }`}
                        >
                            <div
                                className={`h-4 w-4 rounded-full bg-white transition ${enterToSendEnabled
                                        ? 'ml-auto'
                                        : 'ml-0'
                                    }`}
                            />
                        </button>
                    </div>
                </section>

                {/* About */}
                <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#10131a]">
                    <div className="border-b border-white/10 px-5 py-4">
                        <h2 className="text-sm font-semibold text-slate-200">
                            About
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Information about this workspace.
                        </p>
                    </div>

                    <div className="flex items-center justify-between px-5 py-4">
                        <div>
                            <p className="text-sm font-medium text-slate-300">
                                ResilienceLab Chat
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Real-time chat workspace
                            </p>
                        </div>

                        <span className="text-xs text-slate-500">
                            v1.0
                        </span>
                    </div>
                </section>
            </div>
        </div>
    )


}

import Sidebar from './Sidebar'


export default function AppShell({
    children,
    activeRoom,
    onRoomChange,
    rooms,
    onRoomCreated,
    activePage,
    onPageChange,
    userName,
    onLogout,
}) {
    return (<div className="flex h-screen overflow-hidden bg-[#0b0d12] text-white"> <Sidebar
        activeRoom={activeRoom}
        onRoomChange={onRoomChange}
        rooms={rooms}
        onRoomCreated={onRoomCreated}
        activePage={activePage}
        onPageChange={onPageChange}
        userName={userName}
        onLogout={onLogout}
    />


        <div className="flex min-w-0 flex-1 flex-col">

            <main className="min-h-0 flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    </div>
    )


}

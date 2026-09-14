import { useState } from 'react'
import AppShell from './components/layout/AppShell'
import ChatRoom from './components/chat/ChatRoom'
import Settings from './components/settings/Settings'
import RoomEntry from './components/room/RoomEntry'

const SESSION_KEY = 'resilience-chat-session'

function getSavedSession() {
  try {
    const savedSession = localStorage.getItem(SESSION_KEY)

    if (!savedSession) {
      return null
    }

    return JSON.parse(savedSession)
  } catch (error) {
    console.error(
      'Failed to restore chat session:',
      error,
    )

    return null
  }
}

function App() {
  const savedSession = getSavedSession()

  const [activeRoom, setActiveRoom] = useState(
    savedSession?.roomId || null,
  )

  const [rooms, setRooms] = useState(
    savedSession?.roomId
      ? [savedSession.roomId]
      : [],
  )

  const [activePage, setActivePage] = useState(
    'messages',
  )

  const [roomJoined, setRoomJoined] = useState(
    Boolean(savedSession?.roomId),
  )

  const [userName, setUserName] = useState(
    savedSession?.userName || '',
  )

  function handleRoomEnter({
    roomId,
    userName,
  }) {
    const session = {
      roomId,
      userName,
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )

    setActiveRoom(roomId)
    setRooms([roomId])
    setUserName(userName)
    setActivePage('messages')
    setRoomJoined(true)
  }

  function handleRoomCreated({
    roomId,
    userName,
  }) {
    const session = {
      roomId,
      userName,
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )

    setActiveRoom(roomId)
    setRooms([roomId])
    setUserName(userName)
    setActivePage('messages')
    setRoomJoined(true)
  }

  function handleRoomChange(roomId) {
    setActiveRoom(roomId)
    setRooms([roomId])
    setActivePage('messages')

    const session = {
      roomId,
      userName,
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    )
  }

  function handleLogout() {
    if (activeRoom) {
      localStorage.removeItem(
        `resilience-chat-joined-${activeRoom}`,
      )
    }

    localStorage.removeItem(SESSION_KEY)

    setActiveRoom(null)
    setRooms([])
    setUserName('')
    setActivePage('messages')
    setRoomJoined(false)
  }

  if (!roomJoined) {
    return (
      <div className="h-screen bg-[#0b0d12]">
        <RoomEntry
          onRoomEnter={handleRoomEnter}
        />
      </div>
    )
  }

  return (
    <AppShell
      activeRoom={activeRoom}
      onRoomChange={handleRoomChange}
      rooms={rooms}
      onRoomCreated={handleRoomCreated}
      activePage={activePage}
      onPageChange={setActivePage}
      userName={userName}
      onLogout={handleLogout}
    >
      {activePage === 'settings' ? (
        <Settings />
      ) : (
        <ChatRoom
          key={activeRoom}
          roomId={activeRoom}
          userName={userName}
        />
      )}
    </AppShell>
  )
}

export default App
import React, { useEffect, useRef, useState } from 'react'
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import { baseURL } from '../config/AxiosHelper';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import toast from 'react-hot-toast';
import { getMessages } from '../services/RoomService';
import { timeAgo } from '../config/helper';
import Avatar  from '../components/Avatar.jsx'
const ChatPage = () => {

  const { roomId, currUser,connected,setConnected,setRoomId,setCurrUser} = useChatContext();

  
  const navigate = useNavigate();
  useEffect(()=>{
  if(!connected){
    navigate("/")
  }
  },[connected,currUser,roomId])
  const [messages, setMessages] = useState([])
  const [input,setInput] = useState("")
  const chatBoxRef = useRef(null)
  const inputBoxRef = useRef(null)
  const [stompClient , setStompClient] = useState(null)



  //messgae load 
useEffect(()=>{
   async function loadMessages(){
    try {

      
      console.log("roomId before API:", roomId);
      const data = await getMessages(roomId);
      setMessages(data);
      
        } catch (error) {
      
    }
   }
   if(connected){
     loadMessages();
   }
   
},[])

//scroll down messages

useEffect(()=>{
   if(chatBoxRef.current){
    chatBoxRef.current.scroll({
     top:chatBoxRef.current.scrollHeight,
     behavior : "smooth",
    });
   }
},[messages])


  //stompclient subscribe
  useEffect(() => {
  if (!roomId) return;

  console.log("Connecting WebSocket...");

  const socket = new SockJS(`${baseURL}/chat`);
  const client = Stomp.over(socket);

  client.connect({}, () => {
    toast.success("Connected");

    setStompClient(client);

     client.send(
    `/app/sendMessages/${roomId}`,
    {},
    JSON.stringify({
      sender: currUser,
      type: "JOIN"
    })
  );

    client.subscribe(`/topic/room/${roomId}`, (message) => {
      const newMessage = JSON.parse(message.body);
      console.log("RECEIVED:", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    });

  }, (error) => {
    console.error(error);
  });

  return () => {
    console.log("Disconnecting...");
    if (client) {
      client.disconnect(() => {
        console.log("Disconnected");
      });
    }
  };

}, [roomId]);


  //send message handles
  const sendMessage = () => {
  if (connected && stompClient && input.trim() !== "") {

    const message = {
      sender: currUser,
      content: input,
      roomId: roomId,
      type:"CHAT"
    };

    stompClient.send(
      `/app/sendMessages/${roomId}`,
      {},
      JSON.stringify(message)
    );

    setInput("");
  }
};

// leave room 
function handleLogout(){
  if(stompClient){
    stompClient.send(`/app/sendMessages/${roomId}`,{},
      JSON.stringify({
        sender:currUser,
        type:"LEAVE"
      })
    );
stompClient.disconnect();
  }
  
   setConnected(false);
   setCurrUser("");
   setRoomId("");
   navigate("/");
}
  
  return (
    <div>
        <header className='fixed w-full flex justify-around px-6 py-3 dark:border-gray-700 dark:bg-gray-900 items-center'>
                <div>
                    <h1 className='text-xl font-semibold'>Room : <span>{roomId}</span></h1>
                </div>
                <div>
                    <h1 className='text-xl font-semibold'>User : <span>{currUser}</span></h1>
                </div>
                <div>
                    <button onClick={handleLogout} className='px-3 py-2 dark:bg-red-500 hover:dark:bg-red-700 rounded-full cursor-pointer active:scale-95'>Leave Room</button>
                </div>
        </header>
      <main className='dark:bg-gray-700'>

      <div ref={chatBoxRef} className='py-20 px-10 dark:bg-white dark:text-black w-2/3 mx-auto h-screen overflow-auto'>
        <div>
        {
  //               messages.map((message, index) => (
  //               <div key={index} className={`flex ${message.sender === currUser ? "justify-end" : "justify-start"}`}>

  //                 <div className={`my-2 p-2 ${message.sender === currUser ? "bg-cyan-400" : "bg-amber-200"} max-w-xs rounded-lg`}>
  //             <div className='flex flex-row gap-2'>



  //              <Avatar name={message.sender} />
  //              <div className='flex flex-col  gap-1'>    
  //             <p className='text-sm font-bold'>{message.sender}</p>
  //             <p>{message.content}</p>
  //             <p className="text-xs text-gray-500">
  //                 {timeAgo(message.timeStamp)}
  //             </p>
  //            </div>

  //             </div>
             
  //             </div>
  //               </div>
  // ))



    messages.map((message, index) => {

  //  JOIN MESSAGE
  if (message.type === "JOIN") {
    return (
      <div key={index} className="text-center text-green-600 text-sm my-2">
        {message.sender} joined 🎉
      </div>
    );
  }

  //  LEAVE MESSAGE
  if (message.type === "LEAVE") {
    return (
      <div key={index} className="text-center text-red-500 text-sm my-2">
        {message.sender} left 👋
      </div>
    );
  }

  //  NORMAL CHAT MESSAGE
  return (
    <div key={index} className={`flex ${message.sender === currUser ? "justify-end" : "justify-start"}`}>

      <div className={`my-2 p-2 ${message.sender === currUser ? "bg-cyan-400" : "bg-amber-200"} max-w-xs rounded-lg`}>
        
        <div className='flex flex-row gap-2 items-start'>
          
          <Avatar name={message.sender} />

          <div className='flex flex-col gap-1'>
            <p className='text-sm font-bold'>{message.sender}</p>
            <p>{message.content}</p>
            <p className="text-xs text-gray-500">
              {message.timeStamp && timeAgo(message.timeStamp)}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
})}



 
        
        </div>
      </div>


      </main>
      

        <div className='fixed bottom-4 w-full h-11'>
            <div className='flex pr-6 gap-2 justify-between items-center h-full rounded-full w-1/2 mx-auto dark:bg-gray-900'>
              <input onKeyDown={(e)=>{
                 if(e.key ==="Enter"){
                  sendMessage()
                 }
              }} value={input} onChange={(e)=>{setInput(e.target.value)}} className=' dark:bg-gray-600 w-full border py-2 px-4 rounded-full dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500' type="text" placeholder='Type your messages here..' />
              <div className='flex gap-2'>
                <button className='px-3 py-2 h-10 w-10 flex items-center justify-center dark:bg-purple-600 hover:dark:bg-purple-700 rounded-full cursor-pointer active:scale-95'>
                <MdAttachFile size={25}/>
              </button>
            <button onClick={sendMessage} className='px-3 py-2 h-10 w-11 flex items-center justify-center dark:bg-green-600 hover:dark:bg-green-700 rounded-full cursor-pointer active:scale-95'>
                <MdSend size={20}/>
              </button>
              </div>
              
            </div>
        </div>
    </div>
  )
}

export default ChatPage;
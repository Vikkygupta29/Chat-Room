import React, { useState } from 'react'
import ChatIcon from '../assets/bubble-chat.png'
 import toast from 'react-hot-toast';
 import { createRoomApi, joinChatApi } from '../services/RoomService';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
const JoinCreateChat = () => {

    const [details, setDetails] = useState({
       userName:"",
       roomId:"",
    })
   

    const navigate = useNavigate();

    const {roomId,currUser,setCurrUser,setRoomId,connected,setConnected} = useChatContext();

    const handleInputFormChange = (event)=>{
       setDetails(
        {...details,[event.target.name]:event.target.value}
       )
    }

  function validateForm(){
     if(details.roomId==="" || details.userName===""){
       toast.error("Invalid input!");
        return false;
     }
     return true;
  }

   async function joinChat(){
      if(validateForm()){
        // join chat
      try {
        const room = await joinChatApi(details.roomId);
              console.log("API response:", room);
        setRoomId(room.roomId);
 
         
         setCurrUser(details.userName)
         setConnected(true)
          toast.success("joined..")
          navigate("/chat");
         
      } catch (error) {
         if(error.status ==400){
             toast.error(error.response.data);
         }else{
            toast.error("error in joining room!")
         }
           
           console.log(error);
           
      }
      
      }
    }

    async function createRoom(){
       if(validateForm()){
        // create room
     // call api to create room on backend
     try {
        const response = await createRoomApi({
            roomId: details.roomId
        });
         console.log(response);
         toast.success("Room created successfully!!");
         setRoomId(response.roomId);
         setCurrUser(details.userName)
         setConnected(true)
          navigate("/chat");
     } catch (error) {
        const message = error.response?.data?.message ?? error.message ?? "Error creating room";
        toast.error(message);
        
     }
     
      }
    }

  return (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='flex flex-col gap-6 rounded p-10 dark:border-gray-700 border w-full max-w-md shadow dark:bg-gray-900'>
         <div>
            <img src={ChatIcon} className='w-24 mx-auto' />
            </div>   
        <h1 className='text-2xl font-semibold text-center'>Join Room</h1>

        {/* Name */}
        <div>
            <label className='block font-medium mb-2' htmlFor="username">Your Name</label>
            <input onChange={handleInputFormChange}  name='userName' placeholder='Enter your name' value={details.userName} className='w-full dark:bg-gray-600 border py-2 px-2 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" id="username"  />
        </div>
{/* Room ID   */}
        <div>
            <label className='block font-medium mb-2' htmlFor="roomName">Room ID / New Room ID</label>
            <input onChange={handleInputFormChange}  value={details.roomId} placeholder='Enter your room id' name='roomId' className='w-full dark:bg-gray-600 border py-2 px-2 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500' type="text" id="roomName" />
        </div>
  
  {/* buttons */}

        <div className='flex justify-between'>
            <button onClick={joinChat} className='px-3 py-2 dark:bg-blue-500 hover:dark:bg-blue-800 rounded-3xl cursor-pointer active:scale-95'>Join Room</button>
            <button onClick={createRoom} className='px-3 py-2 dark:bg-orange-500 hover:dark:bg-orange-800 rounded-3xl cursor-pointer active:scale-95'>Create Room</button>
        </div>
        </div>
    </div>
  )
}

export default JoinCreateChat
package com.substring.chat.controllers;


import com.substring.chat.entities.Message;
import com.substring.chat.entities.MessageType;
import com.substring.chat.entities.Room;
import com.substring.chat.payloads.MessageRequest;
import com.substring.chat.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@CrossOrigin("*")
public class ChatController {
     @Autowired
    private RoomRepository roomRepository;

     // for sending and receiving messages
     @MessageMapping("/sendMessages/{roomId}")
     @SendTo("/topic/room/{roomId}")
     public Message sendMessages(@DestinationVariable String roomId ,
             @RequestBody MessageRequest messageRequest
             ){
       Room room = roomRepository.findByRoomId(roomId);

       Message message = new Message();
       message.setContent(messageRequest.getContent());
       message.setSender(messageRequest.getSender());
       message.setTimeStamp(LocalDateTime.now());
         MessageType type = messageRequest.getType() != null
                 ? messageRequest.getType()
                 : MessageType.CHAT;

         message.setType(type);

       if (room == null){
           throw new RuntimeException("room not found!!");
       }
         if (messageRequest.getType() == MessageType.CHAT) {

             message.setContent(messageRequest.getContent());

             // save only chat messages
             room.getMessages().add(message);
             roomRepository.save(room);

         } else if (messageRequest.getType() == MessageType.JOIN) {

             message.setContent(message.getSender() + " joined");

         } else if (messageRequest.getType() == MessageType.LEAVE) {

             message.setContent(message.getSender() + " left");

         }

         return message;
     }

}

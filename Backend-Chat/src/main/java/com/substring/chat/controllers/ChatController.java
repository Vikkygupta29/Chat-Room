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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@CrossOrigin("*")
public class ChatController {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // For sending and receiving messages
    @MessageMapping("/sendMessages/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessages(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest messageRequest
    ) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            throw new RuntimeException("room not found!!");
        }

        Message message = new Message();

        message.setId(UUID.randomUUID().toString());
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimeStamp(LocalDateTime.now());

        MessageType type = messageRequest.getType() != null
                ? messageRequest.getType()
                : MessageType.CHAT;

        message.setType(type);

        // Save normal chat and media messages
        if (type == MessageType.CHAT
                || type == MessageType.IMAGE
                || type == MessageType.VIDEO
                || type == MessageType.FILE
                || type == MessageType.JOIN) {

            if (type == MessageType.JOIN) {
                message.setContent(message.getSender() + " joined");
            }

            room.getMessages().add(message);
            roomRepository.save(room);

        } else if (type == MessageType.LEAVE) {

            message.setContent(message.getSender() + " left");
        }

        return message;
    }

    @MessageMapping("/deleteMessage/{roomId}")
    public void deleteMessage(
            @DestinationVariable String roomId,
            @RequestBody Message message
    ) {
        message.setType(MessageType.DELETE);

        messagingTemplate.convertAndSend(
                "/topic/room/" + roomId,
                message
        );
    }
}
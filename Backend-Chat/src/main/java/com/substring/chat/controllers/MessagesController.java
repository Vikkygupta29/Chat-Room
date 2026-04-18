package com.substring.chat.controllers;

import com.substring.chat.entities.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessagesController {

    @MessageMapping("/message")
    @SendTo("/topic/return-to")
    public Message getContent(@RequestBody Message message){
        return message;
    }
}

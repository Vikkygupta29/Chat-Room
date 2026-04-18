package com.substring.chat.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String sender;
    private String content;
    private LocalDateTime timeStamp;
    private MessageType type;

    public Message(String sender, String content, MessageType type) {
        this.sender = sender;
        this.content = content;
        this.type = type;
    }
}

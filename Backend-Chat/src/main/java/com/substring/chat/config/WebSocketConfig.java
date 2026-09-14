package com.substring.chat.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration   //Marks this class as Spring configuration (loaded at startup)
@EnableWebSocketMessageBroker     //   Enables WebSocket + STOMP messaging system
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry config) {
       config.addEndpoint("/chat")     //  Creates WebSocket endpoint
               .setAllowedOrigins(
                       "http://localhost:5173",
                       "https://chat-room-nine-sepia.vercel.app"
               )
               .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
   config.enableSimpleBroker("/topic");   //  Responsible for sending messages to clients
   config.setApplicationDestinationPrefixes("/app");     //  Defines prefix for client → server communication
    }
}

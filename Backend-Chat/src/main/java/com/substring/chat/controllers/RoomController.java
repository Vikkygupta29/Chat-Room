package com.substring.chat.controllers;

import com.substring.chat.payloads.RoomRequest;
import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;
import com.substring.chat.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest request) {

        // create new room
        Room room = roomService.createRoom(request.getRoomId());

        return ResponseEntity.ok(room);
    }

    // Get all rooms
    @GetMapping
    public ResponseEntity<List<String>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRoomIds());
    }

    // Get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> JoinRoom(@PathVariable String roomId) {

        Room room = roomService.getRoom(roomId);

        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found!");
        }

        return ResponseEntity.ok(room);
    }

    // Get messages of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> showMessages(
            @PathVariable String roomId,
            @RequestParam(
                    value = "page",
                    defaultValue = "0",
                    required = false
            ) int page,
            @RequestParam(
                    value = "size",
                    defaultValue = "20",
                    required = false
            ) int size
    ) {

        List<Message> messageList = roomService.getMessages(roomId);

        return ResponseEntity.ok(messageList);
    }

    // Delete message
    @DeleteMapping("/{roomId}/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable String roomId,
            @PathVariable String messageId
    ) {

        boolean deleted = roomService.deleteMessage(roomId, messageId);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok("Message deleted successfully");
    }
}
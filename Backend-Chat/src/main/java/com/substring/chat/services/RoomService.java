package com.substring.chat.services;

import com.substring.chat.entities.Message;
import com.substring.chat.entities.Room;
import com.substring.chat.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room createRoom(String roomId) {
        Room room = new Room();

        if (roomRepository.findByRoomId(roomId) == null) {
            room.setRoomId(roomId);
            return roomRepository.save(room);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Room already exists!!"
            );
        }
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<String> getAllRoomIds() {
        return roomRepository.findAll()
                .stream()
                .map(Room::getRoomId)
                .filter(roomId -> roomId != null && !roomId.isBlank())
                .distinct()
                .toList();
    }

    public Room getRoom(String roomId) {
        return roomRepository.findByRoomId(roomId);
    }

    public List<Message> getMessages(String roomId) {
        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            throw new RuntimeException("Room not found!!");
        }

        boolean updated = false;

        for (Message message : room.getMessages()) {
            if (message.getId() == null || message.getId().isBlank()) {
                message.setId(java.util.UUID.randomUUID().toString());
                updated = true;
            }
        }

        if (updated) {
            roomRepository.save(room);
        }

        return room.getMessages();
    }

    // Delete message
    public boolean deleteMessage(String roomId, String messageId) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            return false;
        }

        boolean removed = room.getMessages()
                .removeIf(message -> messageId.equals(message.getId()));

        if (removed) {
            roomRepository.save(room);
        }

        return removed;
    }
}
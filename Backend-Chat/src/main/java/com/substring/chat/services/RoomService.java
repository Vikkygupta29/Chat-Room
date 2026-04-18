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

    public Room createRoom(String roomId){
        Room room = new Room();
       if(roomRepository.findByRoomId(roomId)==null){
           room.setRoomId(roomId);
           return roomRepository.save(room);
       }else{
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Room already exists!!");
       }

    }

    public Room getRoom(String roomId){
        return roomRepository.findByRoomId(roomId);
    }


    public List<Message> getMessages(String roomId){
      Room room = roomRepository.findByRoomId(roomId);
      if(room == null){
          throw  new RuntimeException("Room not found!!");
      }
      return room.getMessages();
    }
}

import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { DeleteRoomButton } from "@elements/deleteRoomButton/DeleteRoomButton";

import { Room, RoomListProps } from "@typings/Room";

import "./roomList.scss";
import { Icon } from "@/components/elements/icon/Icon";

export const RoomList: React.FC<RoomListProps> = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const firestore = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;
  const [searchedRoom, setSearchedRoom] = useState<string>("");
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    const roomsRef = collection(firestore, "rooms");
    const q = query(roomsRef, where("members", "array-contains", user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Room[];
        setRooms(data);
      }
    );

    return () => unsubscribe();
  });

  const handleRoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const roomName = event.target.value;
    setSearchedRoom(roomName);
    const selectedRoom = rooms.find((room) => room.name === roomName);
    if (selectedRoom) {
      setSelectedRoomId(selectedRoom.id);
    } else {
      setSelectedRoomId("");
    }
  };

  const clearSearch = () => {
    setSearchedRoom("");
  };

  const selectedRoom = rooms.find((room) => room.name === searchedRoom);

  return (
    <div className="roomlist">
      <h3>Search for a room</h3>
      <div className="roomlist__mid">
        <input
          className="roomlist__search"
          type="input"
          list="rooms"
          placeholder="Search for a room"
          value={searchedRoom}
          onChange={handleRoomChange}
        />
        <datalist id="rooms">
          {rooms.map((room) => (
            <option key={room.id} value={room.name} />
          ))}
        </datalist>
        <button
          className="roomlist__searchbutton"
          onClick={() => clearSearch()}
        >
          <Icon name="xmark" type="fas" />{" "}
        </button>
      </div>
      {selectedRoom ? (
        <div
          className="roomlist__details"
          onClick={() => onRoomSelect(selectedRoomId)}
        >
          <img
            className="roomlist__details__image"
            src={selectedRoom.roomURL}
            alt="roomPicture"
            style={{ width: "32px", height: "32px" }}
          />
          <p className="roomlist__details__name">
            Room Name: {selectedRoom.name}
          </p>
          <DeleteRoomButton roomId={selectedRoom.id} />
        </div>
      ) : null}

      {rooms.map((room) => (
        <div className="roomlist__card" key={room.id}>
          <img
            className="roomlist__card__image"
            src={room.roomURL}
            alt="room profile picture"
            style={{ width: "32px", height: "32px" }}
          />
          <button
            className="roomlist__card__enter"
            onClick={() => onRoomSelect(room.id)}
          >
            {room.name}
          </button>
          <DeleteRoomButton roomId={room.id} />
        </div>
      ))}
    </div>
  );
};

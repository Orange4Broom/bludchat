import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { firebaseConfig } from "@fbase/firebase";
import { AddUserToRoom } from "@blocks/addUserToRoom/AddUserToRoom";
import { UsersRoomList } from "@blocks/userRoomList/UsersRoomList";

import { useSendMessage } from "@/hooks/room/useSendMessage";
import { useFileValidation } from "@/hooks/room/useFileValidation";

import { Message } from "@typings/Message";
import { ChatRoomProps } from "@typings/ChatRoomProps";

import "@blocks/chatRoom/chatRoom.scss";
import { AddFriend } from "../friendList/AddFriend";
import { FriendList } from "../friendList/FriendList";
import { useAddUserToRoom } from "@/hooks/room/useAddUserToRoom";
import { useFetchMembers } from "@/hooks/room/useFetchMembers";
import { User } from "@/typings/User";
import { UpdateRoom } from "@/components/elements/updateRoom/UpdateRoom";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomDetails, setRoomDetails] = useState<{
    name: string;
    roomURL: string;
  }>({ name: "", roomURL: "" });
  const currentUser = auth.currentUser as User;
  const { newMessage, setNewMessage, sendMessage } = useSendMessage(roomId);
  const { isImageFile, isVideoFile, isValidURL } = useFileValidation();
  const { handleAddUser } = useAddUserToRoom(roomId);
  const { roomCreatorId } = useFetchMembers(roomId);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const roomDoc = await getDoc(doc(firestore, "rooms", roomId));
      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        setRoomDetails({ name: roomData.name, roomURL: roomData.roomURL });
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    const messagesRef = collection(firestore, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAt"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Message[];
      setMessages(data);
    });
    return unsubscribe;
  }, [roomId]);

  return (
    <>
      <div className="room-details">
        <img
          src={roomDetails.roomURL}
          alt="Room Profile"
          style={{ width: "100px", height: "100px" }}
        />
        <h2 className="room-name">{roomDetails.name}</h2>
      </div>
      {currentUser.uid === roomCreatorId && <UpdateRoom roomId={roomId} />}
      {currentUser.uid === roomCreatorId && <AddUserToRoom roomId={roomId} />}

      <UsersRoomList roomId={roomId} />
      <div className="chat">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`messageFrom__${
              currentUser && msg.uid === currentUser.uid ? "me" : "friend"
            }`}
          >
            <img
              className="userPhoto"
              src={msg.photoURL ?? "defaultPhotoURL"}
              alt="Avatar"
            />
            <div className="message">
              {msg.text && isValidURL(msg.text) ? (
                <a href={msg.text} target="_blank" rel="noopener noreferrer">
                  <img
                    className="chatImage"
                    src={msg.text}
                    alt="Image from URL"
                  />
                </a>
              ) : (
                <p>{msg.text}</p>
              )}
              {msg.fileURL &&
                msg.fileName &&
                (isImageFile(msg.fileName) ? (
                  <img
                    className="chatImage"
                    src={msg.fileURL}
                    alt={msg.fileName}
                  />
                ) : isVideoFile(msg.fileName) ? (
                  <video controls>
                    <source src={msg.fileURL} type="video/mp4" />
                    <source src={msg.fileURL} type="video/webm" />
                    <source src={msg.fileURL} type="video/ogg" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a
                    href={msg.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {msg.fileName}
                  </a>
                ))}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
        <input type="file" id="fileInput" />
      </form>
      <FriendList
        uid={currentUser.uid}
        displayName={currentUser.displayName || "Nameless User"}
        onSelectFriend={handleAddUser}
        roomId={roomId}
      />
      <AddFriend />
    </>
  );
};

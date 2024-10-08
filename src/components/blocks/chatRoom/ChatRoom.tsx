import React, { useState, useEffect, useRef } from "react";
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
import { RoomMembers } from "@/components/blocks/roomMembers/RoomMembers";

import { useSendMessage } from "@/hooks/room/useSendMessage";
import { useFileValidation } from "@/hooks/room/useFileValidation";

import { Message } from "@typings/Message";
import { ChatRoomProps } from "@typings/ChatRoomProps";

import "@blocks/chatRoom/chatRoom.scss";
import { useFetchMembers } from "@/hooks/room/useFetchMembers";
import { User } from "@/typings/User";
import { UpdateRoom } from "@/components/elements/updateRoom/UpdateRoom";
import { Icon } from "@/components/elements/icon/Icon";
import { LeaveRoomButton } from "@/components/elements/leaveRoomButton/LeaveRoomButton";
import { DeleteRoomButton } from "@/components/elements/deleteRoomButton/DeleteRoomButton";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  openRoomList,
  openFriendList,
  handleOpenRoomList,
  handleOpenFriendList,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomDetails, setRoomDetails] = useState<{
    name: string;
    roomURL: string;
  }>({ name: "", roomURL: "" });
  const currentUser = auth.currentUser as User;
  const {
    newMessage,
    setNewMessage,
    sendMessage,
    handleFileChange,
    handleRemovePreview,
    imagePreview,
  } = useSendMessage(roomId);
  const { isImageFile, isVideoFile, isValidURL } = useFileValidation();
  const { roomCreatorId } = useFetchMembers(roomId);
  const [openRoomDetails, setOpenRoomDetails] = useState<boolean>(false);

  const chatRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const isLongMessage = (text: string) => {
    return text.length > 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(e);
    handleRemovePreview();
  };

  return (
    <>
      <div
        className="overlay"
        style={{ display: openRoomDetails ? "flex" : "none" }}
      ></div>
      <div className={`room__details${openRoomDetails ? "" : "__closed"}`}>
        <button
          className="room__details__close-button"
          onClick={() => setOpenRoomDetails(!openRoomDetails)}
        >
          <Icon name="xmark" type="fas" />{" "}
        </button>
        <div className="room__details__info">
          <img
            className="room__details__image"
            src={roomDetails.roomURL}
            alt="Room Profile"
          />
          <h2 className="room__details__name">{roomDetails.name}</h2>
        </div>
        {currentUser.uid === roomCreatorId && <UpdateRoom roomId={roomId} />}
        {currentUser.uid === roomCreatorId && <AddUserToRoom roomId={roomId} />}
        <RoomMembers roomId={roomId} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          {currentUser.uid === roomCreatorId && (
            <DeleteRoomButton
              roomId={roomId}
              buttonText="Delete room"
              width="wide"
            />
          )}
          <LeaveRoomButton uid={currentUser.uid} roomId={roomId} />
        </div>
      </div>

      <div className="chat__nav">
        <div className="chat__nav__info">
          <img
            className="chat__nav__image"
            src={roomDetails.roomURL}
            alt="Room Profile"
          />
          <h2 className="chat__nav__name">{roomDetails.name}</h2>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {openRoomList && (
            <button
              className="chat__nav__menubutton"
              onClick={handleOpenRoomList}
            >
              <Icon name="message" type="fas" />
            </button>
          )}
          {openFriendList && (
            <button
              className="chat__nav__menubutton"
              onClick={handleOpenFriendList}
            >
              <Icon name="user-group" type="fas" />
            </button>
          )}
          <button
            className={`chat__nav__menubutton${
              openRoomDetails ? "__closed" : ""
            }`}
            onClick={() => setOpenRoomDetails(!openRoomDetails)}
          >
            <Icon name="bars" type="fas" />
          </button>
        </div>
      </div>
      <div className="chat" ref={chatRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={` messageFrom__${
              currentUser && msg.uid === currentUser.uid ? "me" : "friend"
            }`}
          >
            <img
              className="userPhoto"
              src={msg.photoURL ?? "defaultPhotoURL"}
              alt="Avatar"
            />
            <div
              className={`message ${
                isLongMessage(msg.text ?? "") ? "long" : ""
              }`}
            >
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
      <form className="messageinput" onSubmit={handleSubmit}>
        <label className="messageinput__file">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Icon name="paperclip" type="fas" />{" "}
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "100%",
          }}
        >
          {imagePreview && (
            <div className="image-previews">
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="image-preview__remove"
                >
                  <Icon name="times" type="fas" />
                </button>
              </div>
            </div>
          )}
          <input
            className="messageinput__input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
          />
        </div>
        <button className="messageinput__submit" type="submit">
          <Icon name="paper-plane" type="fas" />
        </button>
      </form>
    </>
  );
};

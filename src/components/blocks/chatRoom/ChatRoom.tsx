import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase/firebase";
import { AddUserToRoom } from "../addUserToRoom/AddUserToRoom";
import { UsersRoomList } from "../userRoomList/UsersRoomList";
import "./chatRoom.scss";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

interface ChatRoomProps {
  roomId: string;
}

interface Message {
  id: string;
  text?: string;
  fileURL?: string;
  fileName?: string;
  createdAt: unknown;
  uid: string;
  photoURL: string;
}

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const user = auth.currentUser as User;

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser!;
    const text = newMessage;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!text && !file) {
      // Pokud není ani text ani soubor, neodesílat nic
      return;
    }

    const sendFile = async (file: File) => {
      const storageRef = ref(storage, `files/${uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      return {
        fileURL,
        fileName: file.name,
      };
    };

    let fileData = {};
    if (file) {
      fileData = await sendFile(file);
    }

    await addDoc(collection(firestore, "rooms", roomId, "messages"), {
      text,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
      ...fileData,
    });

    setNewMessage("");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  const isVideoFile = (fileName: string) => {
    return /\.(mp4|webm|ogg)$/i.test(fileName);
  };

  const isValidURL = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <>
      <div className="chat">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`messageFrom__${
              user && msg.uid === user.uid ? "me" : "friend"
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
      <AddUserToRoom roomId={roomId} />
      <UsersRoomList roomId={roomId} />
    </>
  );
};

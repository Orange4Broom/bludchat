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

export const ChatRoom: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

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
    await addDoc(collection(firestore, "rooms", roomId, "messages"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    setNewMessage("");
  };

  const sendFile = async (file: File) => {
    const { uid } = auth.currentUser!;
    const storageRef = ref(storage, `files/${uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    await addDoc(collection(firestore, "rooms", roomId, "messages"), {
      fileURL,
      fileName: file.name,
      createdAt: serverTimestamp(),
      uid,
      photoURL: auth.currentUser?.photoURL ?? "defaultPhotoURL",
    });
  };

  const isImageFile = (fileName: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  const isVideoFile = (fileName: string) => {
    return /\.(mp4|webm|ogg)$/i.test(fileName);
  };

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>
            <img src={msg.photoURL ?? "defaultPhotoURL"} alt="Avatar" />
            <p>{msg.text}</p>
            {msg.fileURL &&
              msg.fileName &&
              (isImageFile(msg.fileName) ? (
                <img src={msg.fileURL} alt={msg.fileName} />
              ) : isVideoFile(msg.fileName) ? (
                <video controls>
                  <source src={msg.fileURL} type="video/mp4" />
                  <source src={msg.fileURL} type="video/webm" />
                  <source src={msg.fileURL} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <a href={msg.fileURL} target="_blank" rel="noopener noreferrer">
                  {msg.fileName}
                </a>
              ))}
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
      </form>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            sendFile(e.target.files[0]);
          }
        }}
      />
      <AddUserToRoom roomId={roomId} />
      <UsersRoomList roomId={roomId} />
    </div>
  );
};

import { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useSendMessage = (roomId: string) => {
  const [newMessage, setNewMessage] = useState("");
  const firestore = getFirestore();
  const auth = getAuth();
  const storage = getStorage();

  const sendFile = async (file: File) => {
    const { uid } = auth.currentUser!;
    const storageRef = ref(storage, `files/${uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(storageRef);

    return {
      fileURL,
      fileName: file.name,
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser!;
    const text = newMessage;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!text && !file) {
      return;
    }

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

  return { newMessage, setNewMessage, sendMessage };
};

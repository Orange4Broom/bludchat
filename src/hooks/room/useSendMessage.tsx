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
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    setFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemovePreview = () => {
    setFile(null);
    setImagePreview(null);
  };

  return {
    newMessage,
    setNewMessage,
    sendMessage,
    handleFileChange,
    handleRemovePreview,
    imagePreview,
  };
};

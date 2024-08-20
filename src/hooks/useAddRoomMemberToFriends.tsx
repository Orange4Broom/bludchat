import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { User } from "../typings/User";

export const useAddRoomMemberToFriends = (
  setFriends: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const currentUser = auth.currentUser as User;

  useEffect(() => {
    if (!currentUser) return;

    const friendsCollectionRef = collection(
      firestore,
      "users",
      currentUser.uid,
      "friends"
    );
    const unsubscribe = onSnapshot(friendsCollectionRef, (snapshot) => {
      const friendsList = snapshot.docs.map((doc) => doc.id);
      setFriends(friendsList);
    });

    return () => unsubscribe();
  }, [currentUser, firestore, setFriends]);

  const handleAddUserToRoom = async (friendId: string) => {
    if (!currentUser) {
      console.log("No user is authenticated");
      return;
    }

    setLoading(true);
    try {
      const friendDocRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendDocRef);

      if (!friendDoc.exists()) {
        console.error("Friend not found");
        return;
      }

      const friendData = friendDoc.data();
      const friendProfilePicture =
        friendData?.photoURL || "defaultProfilePictureUrl";
      const friendName = friendData?.name || "Friend Name";

      await setDoc(
        doc(firestore, "users", currentUser.uid, "friends", friendId),
        {
          uid: friendId,
          displayName: friendName,
          photoURL: friendProfilePicture,
        }
      );
    } catch (error) {
      console.error("Error adding friend: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddUserToRoom, loading };
};

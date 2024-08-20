import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { auth } from "@fbase/firebase";

export const useFetchFriends = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const firestore = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchFriends = async () => {
      if (currentUser) {
        const friendsRef = collection(
          firestore,
          "users",
          currentUser.uid,
          "friends"
        );
        const friendsSnapshot = await getDocs(friendsRef);
        const friendsList = friendsSnapshot.docs.map((doc) => doc.id);
        setFriends(friendsList);
      }
    };

    fetchFriends();
  }, [currentUser, firestore]);

  return friends;
};

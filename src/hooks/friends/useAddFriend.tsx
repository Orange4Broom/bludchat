import { useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const useAddFriend = () => {
  const [friendId, setFriendId] = useState("");
  const firestore = getFirestore();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const addFriend = async () => {
    if (!currentUser) {
      console.log("No user is authenticated");
      return;
    }

    try {
      // Fetch friend's profile picture and name
      const friendDocRef = doc(firestore, "users", friendId);
      const friendDoc = await getDoc(friendDocRef);

      if (!friendDoc.exists()) {
        console.error("Friend not found");
        return;
      }

      const friendData = friendDoc.data();
      const friendProfilePicture =
        friendData?.photoURL || "defaultProfilePictureUrl";
      const friendName = friendData?.displayName || "Friend Name";

      // Add friend to current user's friend list
      await setDoc(
        doc(firestore, "users", currentUser.uid, "friends", friendId),
        {
          uid: friendId,
          displayName: friendName,
          photoURL: friendProfilePicture,
        }
      );

      // Add current user to friend's friend list
      await setDoc(
        doc(firestore, "users", friendId, "friends", currentUser.uid),
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "Your Name",
          photoURL: currentUser.photoURL || "yourProfilePictureUrl",
        }
      );

      console.log("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return { friendId, setFriendId, addFriend };
};

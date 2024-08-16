import React, { useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const AddFriend: React.FC = () => {
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
        friendData?.profilePicture || "defaultProfilePictureUrl";
      const friendName = friendData?.name || "Friend Name";

      // Add friend to current user's friend list
      await setDoc(
        doc(firestore, "users", currentUser.uid, "friends", friendId),
        {
          id: friendId,
          name: friendName,
          profilePicture: friendProfilePicture,
        }
      );

      // Add current user to friend's friend list
      await setDoc(
        doc(firestore, "users", friendId, "friends", currentUser.uid),
        {
          id: currentUser.uid,
          name: currentUser.displayName || "Your Name",
          profilePicture: currentUser.photoURL || "yourProfilePictureUrl",
        }
      );

      console.log("Friend added successfully");
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  return (
    <div>
      <h3>Add Friend</h3>
      <input
        type="text"
        value={friendId}
        onChange={(e) => setFriendId(e.target.value)}
        placeholder="Enter Friend ID"
      />
      <button onClick={addFriend}>Add Friend</button>
    </div>
  );
};

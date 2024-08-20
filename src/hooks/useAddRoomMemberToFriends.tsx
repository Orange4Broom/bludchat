import { useState } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { User } from "../typings/User";

export const useAddRoomMemberToFriends = (
  setFriends: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const [loading, setLoading] = useState(false);
  const firestore = getFirestore();
  const currentUser = auth.currentUser as User;

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
        friendData?.profilePicture || "defaultProfilePictureUrl";
      const friendName = friendData?.name || "Friend Name";

      await setDoc(
        doc(firestore, "users", currentUser.uid, "friends", friendId),
        {
          id: friendId,
          name: friendName,
          profilePicture: friendProfilePicture,
        }
      );

      setFriends((prevFriends) => [...prevFriends, friendId]);
    } catch (error) {
      console.error("Error adding friend: ", error);
    } finally {
      setLoading(false);
    }
  };

  return { handleAddUserToRoom, loading };
};

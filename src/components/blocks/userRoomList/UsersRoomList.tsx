import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../../firebase/firebase";
import { auth } from "../../../firebase/firebase";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

interface UsersRoomListProps {
  roomId: string;
}

interface User {
  id: string;
  name: string;
  profilePicture: string;
}

export const UsersRoomList: React.FC<UsersRoomListProps> = ({ roomId }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMembers = async () => {
      const roomRef = doc(firestore, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const memberIds = roomData?.members || [];

        const memberPromises = memberIds.map(async (memberId: string) => {
          const userRef = doc(firestore, "users", memberId);
          const userDoc = await getDoc(userRef);
          return { id: memberId, ...userDoc.data() } as User;
        });

        const membersData = await Promise.all(memberPromises);
        setMembers(membersData);
      }
    };

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

    fetchMembers();
    fetchFriends();
  }, [roomId, currentUser]);

  const handleAddFriend = async (friendId: string) => {
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

      setFriends((prevFriends) => [...prevFriends, friendId]);
    } catch (error) {
      console.error("Error adding friend: ", error);
    }
  };

  return (
    <div>
      <h3>Room Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <img
              src={member.profilePicture}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {member.name}
            {currentUser &&
              (!friends.includes(member.id) ||
                member.id === currentUser.uid) && (
                <button onClick={() => handleAddFriend(member.id)}>
                  Add Friend
                </button>
              )}
          </li>
        ))}
      </ul>
    </div>
  );
};

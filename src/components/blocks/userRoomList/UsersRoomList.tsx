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

import { ChatRoomProps } from "../../../typings/ChatRoomProps";
import { User } from "../../../typings/User";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const UsersRoomList: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [roomCreatorId, setRoomCreatorId] = useState<string | null>(null);
  const currentUser = auth.currentUser as User;

  useEffect(() => {
    const fetchMembers = async () => {
      const roomRef = doc(firestore, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (roomDoc.exists()) {
        const roomData = roomDoc.data();
        const memberIds = roomData?.members || [];
        setRoomCreatorId(roomData?.creatorId || null);

        const memberPromises = memberIds.map(async (memberId: string) => {
          const userRef = doc(firestore, "users", memberId);
          const userDoc = await getDoc(userRef);
          return { uid: memberId, ...userDoc.data() } as User;
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

  const handleAddUserToRoom = async (friendId: string) => {
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

  const handleRemoveUserFromRoom = async (userId: string) => {
    if (!currentUser) {
      console.log("No user is authenticated");
      return;
    }

    try {
      // Remove user from room
      const roomRef = doc(firestore, "rooms", roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        console.error("Room not found");
        return;
      }

      const roomData = roomDoc.data();
      const updatedMembers = roomData?.members.filter(
        (memberId: string) => memberId !== userId
      );

      await setDoc(roomRef, { members: updatedMembers }, { merge: true });

      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.uid !== userId)
      );
    } catch (error) {
      console.error("Error removing user from room: ", error);
    }
  };

  return (
    <div>
      <h3>Room Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.uid}>
            <img
              src={member.photoURL}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {member.displayName}
            {!friends.includes(member.uid) && member.uid !== currentUser.uid ? (
              <button onClick={() => handleAddUserToRoom(member.uid)}>
                Add Friend
              </button>
            ) : (
              currentUser.uid === roomCreatorId &&
              member.uid !== currentUser.uid && (
                <button onClick={() => handleRemoveUserFromRoom(member.uid)}>
                  Remove user from room
                </button>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

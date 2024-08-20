import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { User } from "../../../typings/User";
import { FriendListProps } from "../../../typings/Friend";

export const FriendList: React.FC<FriendListProps> = ({
  uid,
  displayName,
  onSelectFriend,
  inRoom,
}) => {
  const [friends, setFriends] = useState<User[]>([]);
  const firestore = getFirestore();

  useEffect(() => {
    if (!uid) {
      console.error("userId is undefined");
      return;
    }

    const friendsRef = collection(firestore, "users", uid, "friends");
    const unsubscribe = onSnapshot(
      friendsRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as User[];
        setFriends(data);
      },
      (error) => {
        console.error("Error fetching friends:", error);
      }
    );

    return () => unsubscribe();
  }, [uid, firestore]);

  const startChatWithFriend = async (friend: User) => {
    try {
      const roomsRef = collection(firestore, "rooms");
      await addDoc(roomsRef, {
        name: `${friend.displayName} and ${displayName}`,
        creatorId: uid,
        members: [uid, friend.uid],
        createdAt: serverTimestamp(),
      });
      alert(`Chat room created with ${friend.displayName}`);
    } catch (error) {
      console.error("Error creating chat room: ", error);
      alert("Failed to create chat room");
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const friendRef = doc(firestore, "users", uid, "friends", friendId);
      await deleteDoc(friendRef);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.uid !== friendId)
      );
      alert("Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend: ", error);
      alert("Failed to remove friend");
    }
  };

  return (
    <div>
      <h3>Friend List</h3>
      <ul>
        {friends.map((friend) => (
          <div key={friend.uid}>
            <img
              src={friend.photoURL}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {friend.displayName}{" "}
            {inRoom ? (
              <button
                onClick={() => onSelectFriend && onSelectFriend(friend.uid)}
              >
                Add to Room
              </button>
            ) : (
              <>
                <button onClick={() => startChatWithFriend(friend)}>
                  Start Chat
                </button>
                <button onClick={() => removeFriend(friend.uid)}>
                  Remove Friend
                </button>
              </>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

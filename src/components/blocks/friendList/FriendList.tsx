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

interface FriendListProps {
  userId: string;
  userName: string;
  onSelectFriend?: (userId: string) => void;
  inRoom: boolean;
}

interface Friend {
  id: string;
  name: string;
  profilePicture: string;
}

export const FriendList: React.FC<FriendListProps> = ({
  userId,
  userName,
  onSelectFriend,
  inRoom,
}) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const firestore = getFirestore();

  useEffect(() => {
    if (!userId) {
      console.error("userId is undefined");
      return;
    }

    const friendsRef = collection(firestore, "users", userId, "friends");
    const unsubscribe = onSnapshot(
      friendsRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Friend[];
        setFriends(data);
      },
      (error) => {
        console.error("Error fetching friends:", error);
      }
    );

    return () => unsubscribe();
  }, [userId, firestore]);

  const startChatWithFriend = async (friend: Friend) => {
    try {
      const roomsRef = collection(firestore, "rooms");
      await addDoc(roomsRef, {
        name: `${friend.name} and ${userName}`,
        creatorId: userId,
        members: [userId, friend.id],
        createdAt: serverTimestamp(),
      });
      alert(`Chat room created with ${friend.name}`);
    } catch (error) {
      console.error("Error creating chat room: ", error);
      alert("Failed to create chat room");
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const friendRef = doc(firestore, "users", userId, "friends", friendId);
      await deleteDoc(friendRef);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
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
          <div key={friend.id}>
            <img
              src={friend.profilePicture}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {friend.name}{" "}
            {inRoom ? (
              <button
                onClick={() => onSelectFriend && onSelectFriend(friend.id)}
              >
                Add to Room
              </button>
            ) : (
              <>
                <button onClick={() => startChatWithFriend(friend)}>
                  Start Chat
                </button>
                <button onClick={() => removeFriend(friend.id)}>
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

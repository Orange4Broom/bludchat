import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
import { User } from "../../../typings/User";
import { FriendListProps } from "../../../typings/Friend";
import { useStartChatWithFriend } from "../../../hooks/useStartChatWithFriend";
import { useRemoveFriend } from "../../../hooks/useRemoveFriend";

export const FriendList: React.FC<FriendListProps> = ({
  uid,
  displayName,
  onSelectFriend,
  inRoom,
}) => {
  const [friends, setFriends] = useState<User[]>([]);
  const firestore = getFirestore();
  const { startChatWithFriend, loading: chatLoading } = useStartChatWithFriend(
    uid,
    displayName
  );
  const { removeFriend, loading: removeLoading } = useRemoveFriend(uid);

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
                <button
                  onClick={() => startChatWithFriend(friend)}
                  disabled={chatLoading}
                >
                  Start Chat
                </button>
                <button
                  onClick={() => removeFriend(friend.uid, setFriends)}
                  disabled={removeLoading}
                >
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

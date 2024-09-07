import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";

import { useStartChatWithFriend } from "@hooks/friends/useStartChatWithFriend";
import { useRemoveFriend } from "@hooks/friends/useRemoveFriend";
import { useFetchMembers } from "@/hooks/room/useFetchMembers"; // Assuming this is the correct import

import { User } from "@typings/User";
import { FriendListProps } from "@typings/Friend";
import { auth } from "@/firebase/firebase";
import { Icon } from "@/components/elements/icon/Icon";

import "./friendList.scss";

export const FriendList: React.FC<FriendListProps> = ({
  uid,
  displayName,
  onSelectFriend,
  roomId,
}) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [updateFriends, setUpdateFriends] = useState(false);
  const firestore = getFirestore();
  const { startChatWithFriend, loading: chatLoading } = useStartChatWithFriend(
    uid,
    displayName
  );
  const { removeFriend, loading: removeLoading } = useRemoveFriend(uid);
  const { members, roomCreatorId } = useFetchMembers(roomId);
  const currentUser = auth.currentUser as User;

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
  }, [uid, firestore, updateFriends]);

  const handleAddToRoom = (friendUid: string) => {
    if (onSelectFriend) {
      onSelectFriend(friendUid);
      setUpdateFriends((prev) => !prev); // Toggle updateFriends to trigger re-fetch
    }
  };

  const handleFriendInRoom = (friendUid: string) => {
    return members.some((friend) => friend.uid === friendUid);
  };

  return (
    <div className="friendlist">
      <h3 className="friendlist__header">Friend List</h3>
      <div className="friendlist__list">
        {friends.map((friend) => (
          <div key={friend.uid} className="friendlist__card">
            <div className="friendlist__card__info">
              <img
                src={friend.photoURL}
                alt="profilePicture"
                style={{ height: "32px", width: "32px" }}
              />
              <p className="friendlist__card__info__username">{`${friend.displayName.substring(
                0,
                14
              )}...`}</p>
            </div>

            <div className="friendlist__card__options">
              {!handleFriendInRoom(friend.uid) &&
              currentUser.uid === roomCreatorId ? (
                <>
                  <abbr title="Add friend to room">
                    <button
                      className="friendlist__card__option"
                      onClick={() => handleAddToRoom(friend.uid)}
                    >
                      <Icon name="user-plus" type="fas" />
                    </button>
                  </abbr>
                  <abbr title="Start chat with user">
                    <button
                      className="friendlist__card__option"
                      onClick={() => startChatWithFriend(friend)}
                      disabled={chatLoading}
                    >
                      <Icon name="message" type="fas" />
                    </button>
                  </abbr>
                  <abbr title="Remove user from friends">
                    <button
                      className="friendlist__card__option"
                      onClick={() => removeFriend(friend.uid, setFriends)}
                      disabled={removeLoading}
                    >
                      <Icon name="user-minus" type="fas" />
                    </button>
                  </abbr>
                </>
              ) : (
                <>
                  <abbr title="Start chat with user">
                    <button
                      className="friendlist__card__option"
                      onClick={() => startChatWithFriend(friend)}
                      disabled={chatLoading}
                    >
                      <Icon name="message" type="fas" />
                    </button>
                  </abbr>
                  <abbr title="Remove user from Friends">
                    <button
                      className="friendlist__card__option"
                      onClick={() => removeFriend(friend.uid, setFriends)}
                      disabled={removeLoading}
                    >
                      <Icon name="user-minus" type="fas" />
                    </button>
                  </abbr>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

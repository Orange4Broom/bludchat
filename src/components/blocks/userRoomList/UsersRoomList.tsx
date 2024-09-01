import React, { useState, useEffect } from "react";
import { auth, firestore } from "@fbase/firebase";

import { useFetchMembers } from "@hooks/room/useFetchMembers";
import { useFetchFriends } from "@hooks/friends/useFetchFriends";
import { useRemoveUserFromRoom } from "@hooks/room/useRemoveUserFromRoom";
import { useAddRoomMemberToFriends } from "@hooks/friends/useAddRoomMemberToFriends";

import { ChatRoomProps } from "@typings/ChatRoomProps";
import { User } from "@typings/User";
import {
  collection,
  DocumentData,
  onSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { LeaveRoomButton } from "@/components/elements/leaveRoomButton/LeaveRoomButton";

export const UsersRoomList: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [searchFirends, setSearchFirends] = useState<User[]>([]);
  const { members, roomCreatorId } = useFetchMembers(roomId);
  const fetchedFriends = useFetchFriends();
  const { handleAddUserToRoom, loading: addLoading } =
    useAddRoomMemberToFriends(setFriends);
  const { handleRemoveUserFromRoom, loading: removeLoading } =
    useRemoveUserFromRoom(roomId);
  const currentUser = auth.currentUser as User;
  const [findedFriend, setFindedFriend] = useState<string>("");
  const [selectedFriendKey, setSelectedFriendKey] = useState<string | null>(
    null
  );

  useEffect(() => {
    setFriends(fetchedFriends);
  }, [fetchedFriends]);

  useEffect(() => {
    const friendsRef = collection(
      firestore,
      "users",
      currentUser.uid,
      "friends"
    );
    const unsubscribe = onSnapshot(
      friendsRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as User[];
        setSearchFirends(data);
      },
      (error) => {
        console.error("Error fetching friends:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFindedFriend(value);

    const selectedFriend = searchFirends.find(
      (friend) => friend.displayName === value
    );
    if (selectedFriend) {
      setSelectedFriendKey(selectedFriend.uid);
    } else {
      setSelectedFriendKey(null);
    }
  };

  return (
    <>
      <h3>Room Members</h3>
      <h4>Search room members</h4>
      <input
        type="text"
        list="friends"
        value={findedFriend}
        onChange={handleInputChange}
        placeholder="Search for a room members"
      />
      <datalist id="friends">
        {searchFirends.map((friend) => (
          <option key={friend.uid} value={friend.displayName} />
        ))}
      </datalist>
      {selectedFriendKey && (
        <>
          <img
            src={
              searchFirends.find((friend) => friend.uid === selectedFriendKey)
                ?.photoURL
            }
            alt="profilePicture"
            style={{ height: "32px", width: "32px" }}
          />
          <p>
            {
              searchFirends.find((friend) => friend.uid === selectedFriendKey)
                ?.displayName
            }
          </p>
          {!friends.includes(selectedFriendKey) &&
          selectedFriendKey !== currentUser.uid ? (
            <button
              onClick={() => handleAddUserToRoom(selectedFriendKey)}
              disabled={addLoading}
            >
              Add User to room
            </button>
          ) : currentUser.uid === roomCreatorId &&
            selectedFriendKey !== currentUser.uid &&
            members.some((member) => member.uid === selectedFriendKey) ? (
            <button
              onClick={() => {
                handleRemoveUserFromRoom(selectedFriendKey);
                setFindedFriend("");
                setSelectedFriendKey(null);
              }}
              disabled={removeLoading}
            >
              Remove user from room
            </button>
          ) : null}
        </>
      )}
      <ul>
        {members.map((member: User) => (
          <li key={member.uid}>
            <img
              src={member.photoURL}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {member.displayName}
            {!friends.includes(member.uid) && member.uid !== currentUser.uid ? (
              <button
                onClick={() => handleAddUserToRoom(member.uid)}
                disabled={addLoading}
              >
                Add Friend
              </button>
            ) : (
              currentUser.uid === roomCreatorId &&
              member.uid !== currentUser.uid && (
                <button
                  onClick={() => handleRemoveUserFromRoom(member.uid)}
                  disabled={removeLoading}
                >
                  Remove user from room
                </button>
              )
            )}
          </li>
        ))}
      </ul>
      <LeaveRoomButton uid={currentUser.uid} roomId={roomId} />
    </>
  );
};

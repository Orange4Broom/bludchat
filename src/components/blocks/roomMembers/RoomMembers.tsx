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
import { useAddUserToRoom } from "@/hooks/room/useAddUserToRoom";

export const RoomMembers: React.FC<ChatRoomProps> = ({ roomId }) => {
  const [friends, setFriends] = useState<string[]>([]);
  const [searchFriends, setSearchFriends] = useState<User[]>([]);
  const { members, roomCreatorId } = useFetchMembers(roomId);
  const fetchedFriends = useFetchFriends();
  const { handleAddUserToRoom, loading: addLoading } =
    useAddRoomMemberToFriends(setFriends);
  const { handleRemoveUserFromRoom, loading: removeLoading } =
    useRemoveUserFromRoom(roomId);
  const currentUser = auth.currentUser as User;
  const [findedFriend, setFindedFriend] = useState<string>("");
  const [findedMember, setFindedMember] = useState<string>("");
  const [selectedFriendKey, setSelectedFriendKey] = useState<string | null>(
    null
  );
  const [selectedMemberKey, setSelectedMemberKey] = useState<string | null>(
    null
  );

  const {
    handleAddUser,
    setUserId,
    userId,
    loading: AddLoading,
  } = useAddUserToRoom(roomId);

  console.log(userId);

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
        setSearchFriends(data);
      },
      (error) => {
        console.error("Error fetching friends:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleFriendInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFindedFriend(value);

    const selectedFriend = searchFriends.find(
      (friend) => friend.displayName === value
    );
    if (selectedFriend) {
      setSelectedFriendKey(selectedFriend.uid);
      setUserId(selectedFriend.uid);
    } else {
      setSelectedFriendKey(null);
    }
  };

  const handleMemberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFindedMember(value);

    const selectedMember = members.find(
      (member) => member.displayName === value
    );
    if (selectedMember) {
      setSelectedMemberKey(selectedMember.uid);
    } else {
      setSelectedMemberKey(null);
    }
  };

  return (
    <div className="room-members">
      <h3 className="room-members__header">Room Members</h3>
      <h4 className="room-members__subheader">Search for friends to add</h4>
      <input
        className="room-members__input"
        type="text"
        list="friends"
        value={findedFriend}
        onChange={handleFriendInputChange}
        placeholder="Search friends"
      />
      <datalist id="friends">
        {searchFriends.map((friend) =>
          members.some((member) => member.uid === friend.uid) ? null : (
            <option key={friend.uid} value={friend.displayName} />
          )
        )}
      </datalist>
      {selectedFriendKey && (
        <>
          <img
            src={
              searchFriends.find((friend) => friend.uid === selectedFriendKey)
                ?.photoURL
            }
            alt="profilePicture"
            style={{ height: "32px", width: "32px" }}
          />
          <p>
            {
              searchFriends.find((friend) => friend.uid === selectedFriendKey)
                ?.displayName
            }
          </p>
          {!members.find((member) => member.uid === selectedFriendKey) &&
          selectedFriendKey !== currentUser.uid ? (
            <button onClick={handleAddUser} disabled={AddLoading}>
              Add User to room
            </button>
          ) : null}
        </>
      )}
      <h4 className="room-members__subheader">Search for room members</h4>
      <input
        className="room-members__input"
        type="text"
        list="room-members"
        value={findedMember}
        onChange={handleMemberInputChange}
        placeholder="Search members"
      />
      <datalist id="room-members">
        {members.map((member) =>
          member.uid !== currentUser.uid ? (
            <option key={member.uid} value={member.displayName} />
          ) : null
        )}
      </datalist>
      {selectedMemberKey && (
        <>
          <img
            src={
              members.find((member) => member.uid === selectedMemberKey)
                ?.photoURL
            }
            alt="profilePicture"
            style={{ height: "32px", width: "32px" }}
          />
          <p>
            {
              members.find((member) => member.uid === selectedMemberKey)
                ?.displayName
            }
          </p>
          {!friends.includes(selectedMemberKey) &&
          selectedMemberKey !== currentUser.uid ? (
            <button
              onClick={() => handleAddUserToRoom(selectedMemberKey)}
              disabled={addLoading}
            >
              Add to friends
            </button>
          ) : currentUser.uid === roomCreatorId &&
            selectedMemberKey !== currentUser.uid ? (
            <button
              onClick={() => handleRemoveUserFromRoom(selectedMemberKey)}
              disabled={removeLoading}
            >
              Remove from room
            </button>
          ) : null}
        </>
      )}
      <div>
        {members.map((member: User) => (
          <div key={member.uid}>
            <img
              src={member.photoURL}
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            {member.displayName === currentUser.displayName ? (
              <p>{member.displayName} (You)</p>
            ) : (
              <p>{member.displayName}</p>
            )}
            {!friends.includes(member.uid) && member.uid !== currentUser.uid ? (
              <button
                onClick={() => handleAddUserToRoom(member.uid)}
                disabled={addLoading}
              >
                Add Friend
              </button>
            ) : (
              currentUser.uid === roomCreatorId && (
                <button
                  onClick={() => handleRemoveUserFromRoom(member.uid)}
                  disabled={removeLoading}
                >
                  Remove user from room
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

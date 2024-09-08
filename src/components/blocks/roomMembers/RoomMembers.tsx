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

import "./roomMembers.scss";
import { Icon } from "@/components/elements/icon/Icon";

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
    loading: AddLoading,
  } = useAddUserToRoom(roomId);

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

  const handleAddUserAction = () => {
    handleAddUser();
    clearUserSearch();
  };

  const clearUserSearch = () => {
    setFindedFriend("");
    setSelectedFriendKey(null);
  };

  const clearMemberSearch = () => {
    setFindedMember("");
    setSelectedMemberKey(null);
  };

  return (
    <div className="room-members">
      <h4 className="room-members__subheader">Search for friends to add</h4>
      <div className="room-members__mid">
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
        <abbr title="Clear search">
          <button
            className="room-members__clear-search"
            onClick={() => clearUserSearch()}
          >
            <Icon name="xmark" type="fas" />{" "}
          </button>
        </abbr>
      </div>
      {selectedFriendKey && (
        <div className="room-members__selected-user">
          <div className="room-members__selected-user__info">
            <img
              className="room-members__selected-user__image"
              src={
                searchFriends.find((friend) => friend.uid === selectedFriendKey)
                  ?.photoURL
              }
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            <p className="room-members__selected-user__name">
              {
                searchFriends.find((friend) => friend.uid === selectedFriendKey)
                  ?.displayName
              }
            </p>
          </div>
          {!members.find((member) => member.uid === selectedFriendKey) &&
          selectedFriendKey !== currentUser.uid ? (
            <abbr title="Add user to room">
              <button
                className="room-members__selected-user__add-to-room"
                onClick={() => {
                  handleAddUserAction();
                }}
                disabled={AddLoading}
              >
                <Icon name="user-plus" type="fas" />
              </button>
            </abbr>
          ) : null}
        </div>
      )}
      <h4 className="room-members__subheader">Search for room members</h4>
      <div className="room-members__mid">
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
        <abbr title="Clear search">
          <button
            className="room-members__clear-search"
            onClick={() => clearMemberSearch()}
          >
            <Icon name="xmark" type="fas" />{" "}
          </button>
        </abbr>
      </div>
      {selectedMemberKey && (
        <div className="room-members__selected-member">
          <div className="room-members__selected-member__info">
            <img
              className="room-members__selected-member__image"
              src={
                members.find((member) => member.uid === selectedMemberKey)
                  ?.photoURL
              }
              alt="profilePicture"
              style={{ height: "32px", width: "32px" }}
            />
            <p className="room-members__selected-member__name">
              {
                members.find((member) => member.uid === selectedMemberKey)
                  ?.displayName
              }
            </p>
          </div>
          <div className="room-members__selected-member__buttons">
            {!friends.includes(selectedMemberKey) &&
            selectedMemberKey !== currentUser.uid ? (
              <>
                <abbr title="Add user to friends">
                  <button
                    className="room-members__selected-member__add-to-friends"
                    onClick={() => {
                      handleAddUserToRoom(selectedMemberKey),
                        clearMemberSearch();
                    }}
                    disabled={addLoading}
                  >
                    <Icon name="user-plus" type="fas" />
                  </button>
                </abbr>
                {currentUser.uid === roomCreatorId &&
                selectedMemberKey !== currentUser.uid ? (
                  <abbr title="Remove user from room">
                    <button
                      className="room-members__selected-member__remove-from-room"
                      onClick={() => {
                        handleRemoveUserFromRoom(selectedMemberKey),
                          clearMemberSearch();
                      }}
                      disabled={removeLoading}
                    >
                      <Icon name="user-minus" type="fas" />
                    </button>
                  </abbr>
                ) : null}
              </>
            ) : currentUser.uid === roomCreatorId &&
              selectedMemberKey !== currentUser.uid ? (
              <div className="room-members__selected-member__buttons">
                <abbr title="Remove use from room">
                  <button
                    className="room-members__selected-member__remove-from-room"
                    onClick={() => {
                      handleRemoveUserFromRoom(selectedMemberKey),
                        clearMemberSearch();
                    }}
                    disabled={removeLoading}
                  >
                    <Icon name="user-minus" type="fas" />
                  </button>
                </abbr>
                {!friends.includes(selectedMemberKey) &&
                selectedMemberKey !== currentUser.uid ? (
                  <abbr title="Add user to friends">
                    <button
                      className="room-members__selected-member__add-to-friends"
                      onClick={() => {
                        handleAddUserToRoom(selectedMemberKey),
                          clearMemberSearch();
                      }}
                      disabled={addLoading}
                    >
                      <Icon name="user-plus" type="fas" />
                    </button>
                  </abbr>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      )}
      <h3>Room members</h3>
      <div className="room-members__list">
        {members.map((member: User) => (
          <div className="room-members__card" key={member.uid}>
            <div className="room-members__card__info">
              <img
                className="room-members__card__image"
                src={member.photoURL}
                alt="profilePicture"
                style={{ height: "32px", width: "32px" }}
              />
              {member.displayName === currentUser.displayName ? (
                <p className="room-members__card__name">
                  {`${member.displayName.substring(0, 16)}... (You)`}
                </p>
              ) : (
                <p className="room-members__card__name">
                  {member.displayName.length > 16
                    ? `${member.displayName.substring(0, 16)}...`
                    : member.displayName}
                </p>
              )}
            </div>
            <div className="room-members__card__buttons">
              {!friends.includes(member.uid) &&
              member.uid !== currentUser.uid ? (
                <>
                  <abbr title="Add user to friends">
                    <button
                      className="room-members__card__add-to-friends"
                      onClick={() => handleAddUserToRoom(member.uid)}
                      disabled={addLoading}
                    >
                      <Icon name="user-plus" type="fas" />
                    </button>
                  </abbr>
                  {currentUser.uid === roomCreatorId && (
                    <abbr title="Remove user from room">
                      <button
                        className="room-members__card__remove-from-room"
                        onClick={() => handleRemoveUserFromRoom(member.uid)}
                        disabled={removeLoading}
                      >
                        <Icon name="user-minus" type="fas" />
                      </button>
                    </abbr>
                  )}
                </>
              ) : (
                <>
                  {currentUser.uid === roomCreatorId && (
                    <abbr title="Remove user from room">
                      <button
                        className="room-members__card__remove-from-room"
                        onClick={() => handleRemoveUserFromRoom(member.uid)}
                        disabled={removeLoading}
                      >
                        <Icon name="user-minus" type="fas" />
                      </button>
                    </abbr>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

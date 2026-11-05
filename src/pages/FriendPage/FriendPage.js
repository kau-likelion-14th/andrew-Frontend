import React, { useEffect, useRef, useState } from "react";
import FriendList from "./FriendList";
import FriendSearch from "./FriendSearch";
import FriendUnfollowModal from "./FriendUnfollowModal";
import api from "../../Api";
import config from "../../Config";
import { toFriendModel } from "./friendModel";
import "../../styles/FriendPage.css";

function FriendPage() {
  // 서버에서 받아온 팔로우 목록
  const [followList, setFollowList] = useState([]);

  // 목록 조회 상태
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // 재시도 버튼을 누르면 값을 변경해 목록 조회 Effect를 다시 실행
  const [reloadCount, setReloadCount] = useState(0);

  // 언팔로우 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // 언팔로우 요청 상태
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeError, setRemoveError] = useState("");

  // 렌더링 전 연속 클릭까지 막기 위한 요청 진행 여부
  const removingRef = useRef(false);
  const followingRef = useRef(false);
  const [followingId, setFollowingId] = useState(null);
  const [followError, setFollowError] = useState("");
  const [candidatesVersion, setCandidatesVersion] = useState(0);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchFollowings = async () => {
      setLoading(true);
      setLoadError("");

      try {
        // 공통 api가 인증 헤더와 만료 토큰 재발급을 처리합니다.
        const { data } = await api.get(
          config.FOLLOW.FOLLOWINGS,
          {
            signal: controller.signal,
          }
        );

        // 잘못된 응답을 빈 목록으로 처리하지 않고 오류로 구분합니다.
        if (
          data?.isSuccess === false ||
          !Array.isArray(data?.result) ||
          data.result.some((user) => user?.userId == null)
        ) {
          throw new Error("잘못된 팔로우 목록 응답");
        }

        if (active) {
          setFollowList(data.result.map(toFriendModel));
        }
      } catch {
        if (active) {
          setLoadError("팔로우 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFollowings();

    // 페이지를 벗어나거나 Effect가 다시 실행될 때 이전 요청을 정리합니다.
    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadCount]);

  const handleFollow = async (user) => {
    // 목록을 확인하지 못한 상태와 관계 변경 중에는 추가 요청을 막습니다.
    if (loading || loadError || isModalOpen || followingRef.current || removingRef.current ||
        !user || followList.some((friend) => friend.id === user.id)) return;
    followingRef.current = true;
    setFollowingId(user.id);
    setFollowError("");
    try {
      const { data } = await api.post(config.FOLLOW.CREATE, { toUserId: user.userId });
      if (data?.isSuccess === false || data?.result?.userId == null ||
          String(data.result.userId) !== user.id) {
        throw new Error("잘못된 팔로우 응답");
      }
      const addedFriend = toFriendModel(data.result);
      setFollowList((prev) => prev.some((friend) => friend.id === addedFriend.id)
        ? prev : [...prev, addedFriend]);
      // 서버에서 팔로우 가능한 목록을 다시 받아 페이지 경계도 맞춥니다.
      setCandidatesVersion((version) => version + 1);
    } catch {
      setFollowError("팔로우에 실패했습니다. 목록을 확인한 뒤 다시 시도해 주세요.");
    } finally {
      followingRef.current = false;
      setFollowingId(null);
    }
  };

  const handleClickRemove = (friend) => {
    if (removingRef.current || followingRef.current) return;

    setSelectedFriend(friend);
    setRemoveError("");
    setIsModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedFriend || removingRef.current) return;

    removingRef.current = true;
    setIsRemoving(true);
    setRemoveError("");

    try {
      // Axios DELETE 요청의 본문은 옵션 객체의 data에 넣습니다.
      const { data } = await api.delete(
        config.FOLLOW.DELETE,
        {
          data: {
            toUserId: selectedFriend.userId,
          },
        }
      );

      if (data?.isSuccess === false) {
        throw new Error("언팔로우 실패");
      }

      // 서버 성공을 확인한 뒤 화면의 목록에서도 제거합니다.
      setFollowList((prev) =>
        prev.filter(
          (friend) => friend.id !== selectedFriend.id
        )
      );

      setIsModalOpen(false);
      setSelectedFriend(null);
      setCandidatesVersion((version) => version + 1);
    } catch {
      // 실패하면 목록과 모달을 유지합니다.
      setRemoveError(
        "언팔로우에 실패했습니다. 다시 시도해 주세요."
      );
    } finally {
      removingRef.current = false;
      setIsRemoving(false);
    }
  };

  const handleCloseModal = () => {
    // 요청 중에는 모달을 닫지 않습니다.
    if (removingRef.current) return;

    setIsModalOpen(false);
    setSelectedFriend(null);
    setRemoveError("");
  };

  return (
    <div className="friend-page">
      <div className="friend-page__inner">
        <div className="friend-page__grid">
          <FriendList
            friends={followList}
            onClickRemove={handleClickRemove}
            loading={loading}
            error={loadError}
            onRetry={() =>
              setReloadCount((count) => count + 1)
            }
            emptyText="팔로우하는 친구가 없습니다."
          />

          <FriendSearch
            onFollow={handleFollow}
            followingList={followList}
            followingId={followingId}
            followError={followError}
            followDisabled={loading || Boolean(loadError) || isModalOpen || isRemoving}
            refreshKey={candidatesVersion}
          />
        </div>
      </div>

      <FriendUnfollowModal
        isOpen={isModalOpen}
        friend={selectedFriend}
        onConfirm={handleConfirmRemove}
        onClose={handleCloseModal}
        isSubmitting={isRemoving}
        error={removeError}
      />
    </div>
  );
}

export default FriendPage;

import React, { useEffect } from "react";
import "../../styles/FriendUnfollowModal.css";

function FriendUnfollowModal({ isOpen, friend, onConfirm, onClose }) {
  // useEffect: 모달이 열려있을 때만 Esc 키 감지 이벤트를 등록하고, 닫힐 때 제거함
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    // Cleanup 함수: 모달이 언마운트되거나 재렌더링 시 이벤트 중복 등록을 방지함
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // isOpen이 false면 아무것도 화면에 그리지 않음
  if (!isOpen) return null;

  const displayName = friend?.name ?? "";
  const displayTag = friend?.tag ? `#${friend.tag}` : "";

  // 모달 배경 클릭 시 창이 닫히도록 설정
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="friend-unfollow-modal__overlay" onClick={handleOverlayClick}>
      <div
        className="friend-unfollow-modal__content"
        role="dialog"
        aria-modal="true"
      >
        <p className="friend-unfollow-modal__text">
          <span className="friend-unfollow-modal__name">{displayName}</span>{" "}
          <span className="friend-unfollow-modal__tag">{displayTag}</span>
          님을 팔로우 목록에서
          <br />
          삭제하시겠습니까?
        </p>

        <div className="friend-unfollow-modal__actions">
          {/* '예' 버튼 클릭 시 부모의 삭제 확정 함수(onConfirm) 실행 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--yes"
            onClick={onConfirm}
          >
            예
          </button>

          {/* '아니오' 버튼 클릭 시 부모의 모달 닫기 함수(onClose) 실행 */}
          <button
            type="button"
            className="friend-unfollow-modal__btn friend-unfollow-modal__btn--no"
            onClick={onClose}
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendUnfollowModal;